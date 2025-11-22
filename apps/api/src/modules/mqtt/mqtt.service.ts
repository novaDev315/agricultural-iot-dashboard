import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { DevicesService } from '../devices/devices.service';
import { SensorsService } from '../sensors/sensors.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { DeviceStatus } from '../../database/entities/device.entity';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: mqtt.MqttClient | null = null;
  private readonly logger = new Logger(MqttService.name);
  private connected = false;

  constructor(
    private configService: ConfigService,
    private devicesService: DevicesService,
    private sensorsService: SensorsService,
    @Inject(forwardRef(() => WebsocketGateway))
    private websocketGateway: WebsocketGateway,
  ) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    const host = this.configService.get<string>('mqtt.host');
    const port = this.configService.get<number>('mqtt.port');
    const username = this.configService.get<string>('mqtt.username');
    const password = this.configService.get<string>('mqtt.password');
    const clientId = this.configService.get<string>('mqtt.clientId');

    const url = `mqtt://${host}:${port}`;

    this.logger.log(`Connecting to MQTT broker: ${url}`);

    try {
      this.client = mqtt.connect(url, {
        clientId: `${clientId}-${Date.now()}`,
        username,
        password,
        reconnectPeriod: 5000,
        connectTimeout: 30000,
      });

      this.client.on('connect', () => {
        this.connected = true;
        this.logger.log('Connected to MQTT broker');
        this.subscribeToTopics();
      });

      this.client.on('error', (error) => {
        this.logger.error(`MQTT error: ${error.message}`);
      });

      this.client.on('close', () => {
        this.connected = false;
        this.logger.warn('MQTT connection closed');
      });

      this.client.on('message', (topic, message) => {
        this.handleMessage(topic, message);
      });
    } catch (error) {
      this.logger.error(`Failed to connect to MQTT: ${error}`);
    }
  }

  private async disconnect() {
    if (this.client) {
      this.client.end();
      this.connected = false;
    }
  }

  private subscribeToTopics() {
    if (!this.client) return;

    const topics = [
      'agri-iot/+/sensors/+/data',
      'agri-iot/+/devices/+/telemetry',
      'agri-iot/+/devices/+/status',
      'agri-iot/+/irrigation/+/status',
      'agri-iot/+/weather/data',
    ];

    topics.forEach((topic) => {
      this.client?.subscribe(topic, (err) => {
        if (err) {
          this.logger.error(`Failed to subscribe to ${topic}: ${err.message}`);
        } else {
          this.logger.log(`Subscribed to ${topic}`);
        }
      });
    });
  }

  private async handleMessage(topic: string, message: Buffer) {
    try {
      const data = JSON.parse(message.toString());
      const topicParts = topic.split('/');

      if (topicParts[2] === 'sensors' && topicParts[4] === 'data') {
        await this.handleSensorData(topicParts[1], topicParts[3], data);
      } else if (topicParts[2] === 'devices' && topicParts[4] === 'telemetry') {
        await this.handleDeviceTelemetry(topicParts[1], topicParts[3], data);
      } else if (topicParts[2] === 'devices' && topicParts[4] === 'status') {
        await this.handleDeviceStatus(topicParts[1], topicParts[3], data);
      }
    } catch (error) {
      this.logger.error(`Failed to handle MQTT message: ${error}`);
    }
  }

  private async handleSensorData(farmId: string, deviceId: string, data: Record<string, unknown>) {
    const device = await this.devicesService.findByDeviceId(deviceId);

    if (!device) {
      this.logger.warn(`Unknown device: ${deviceId}`);
      return;
    }

    const readings = data.readings as Array<{
      type: string;
      value: number;
      unit: string;
    }>;

    if (readings && Array.isArray(readings)) {
      for (const reading of readings) {
        await this.sensorsService.storeSensorReading({
          sensorId: `${deviceId}-${reading.type}`,
          deviceId,
          farmId: device.farmId,
          zoneId: device.zoneId,
          type: reading.type,
          value: reading.value,
          unit: reading.unit,
          timestamp: new Date(),
        });
      }

      // Broadcast to WebSocket clients
      this.websocketGateway.broadcastSensorData(device.farmId, {
        deviceId,
        readings,
        timestamp: new Date(),
      });
    }
  }

  private async handleDeviceTelemetry(farmId: string, deviceId: string, data: Record<string, unknown>) {
    await this.devicesService.updateStatus(deviceId, DeviceStatus.ONLINE, {
      batteryLevel: data.batteryLevel as number,
      signalStrength: data.signalStrength as number,
      lastSeen: new Date(),
    });

    this.websocketGateway.broadcastDeviceStatus(farmId, {
      deviceId,
      status: 'online',
      ...data,
    });
  }

  private async handleDeviceStatus(farmId: string, deviceId: string, data: { status: string }) {
    const status = data.status === 'online' ? DeviceStatus.ONLINE : DeviceStatus.OFFLINE;
    await this.devicesService.updateStatus(deviceId, status);

    this.websocketGateway.broadcastDeviceStatus(farmId, {
      deviceId,
      status: data.status,
    });
  }

  async sendIrrigationCommand(farmId: string, systemId: string, command: string, payload: Record<string, unknown>) {
    const topic = `agri-iot/${farmId}/irrigation/${systemId}/command`;
    await this.publish(topic, { command, ...payload });
  }

  async sendDeviceCommand(farmId: string, deviceId: string, command: string, payload?: Record<string, unknown>) {
    const topic = `agri-iot/${farmId}/devices/${deviceId}/command`;
    await this.publish(topic, { command, ...payload });
  }

  private async publish(topic: string, payload: Record<string, unknown>): Promise<void> {
    if (!this.client || !this.connected) {
      this.logger.warn('MQTT not connected, cannot publish');
      return;
    }

    return new Promise((resolve, reject) => {
      this.client?.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
        if (err) {
          this.logger.error(`Failed to publish to ${topic}: ${err.message}`);
          reject(err);
        } else {
          this.logger.debug(`Published to ${topic}`);
          resolve();
        }
      });
    });
  }

  isConnected(): boolean {
    return this.connected;
  }
}
