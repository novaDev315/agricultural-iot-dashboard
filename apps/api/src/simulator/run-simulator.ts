import * as mqtt from 'mqtt';

// IoT Device Simulator for testing
// Simulates multiple sensor nodes sending data to the MQTT broker

interface SimulatedSensor {
  type: string;
  baseValue: number;
  variance: number;
  unit: string;
}

interface SimulatedDevice {
  id: string;
  farmId: string;
  zoneId: string;
  name: string;
  sensors: SimulatedSensor[];
}

const devices: SimulatedDevice[] = [
  {
    id: 'sensor-node-001',
    farmId: 'demo-farm',
    zoneId: 'zone-north',
    name: 'North Field Sensor Node',
    sensors: [
      { type: 'soil_moisture', baseValue: 45, variance: 10, unit: '%' },
      { type: 'soil_temperature', baseValue: 18, variance: 3, unit: '°C' },
      { type: 'air_temperature', baseValue: 24, variance: 5, unit: '°C' },
      { type: 'air_humidity', baseValue: 60, variance: 15, unit: '%' },
    ],
  },
  {
    id: 'sensor-node-002',
    farmId: 'demo-farm',
    zoneId: 'zone-south',
    name: 'South Field Sensor Node',
    sensors: [
      { type: 'soil_moisture', baseValue: 38, variance: 12, unit: '%' },
      { type: 'soil_temperature', baseValue: 19, variance: 3, unit: '°C' },
      { type: 'air_temperature', baseValue: 25, variance: 4, unit: '°C' },
      { type: 'air_humidity', baseValue: 55, variance: 10, unit: '%' },
    ],
  },
  {
    id: 'sensor-node-003',
    farmId: 'demo-farm',
    zoneId: 'zone-greenhouse',
    name: 'Greenhouse Sensor Node',
    sensors: [
      { type: 'soil_moisture', baseValue: 55, variance: 5, unit: '%' },
      { type: 'air_temperature', baseValue: 28, variance: 3, unit: '°C' },
      { type: 'air_humidity', baseValue: 70, variance: 8, unit: '%' },
      { type: 'light_intensity', baseValue: 45000, variance: 15000, unit: 'lux' },
      { type: 'co2_level', baseValue: 800, variance: 200, unit: 'ppm' },
    ],
  },
  {
    id: 'weather-station-001',
    farmId: 'demo-farm',
    zoneId: 'zone-main',
    name: 'Main Weather Station',
    sensors: [
      { type: 'air_temperature', baseValue: 24, variance: 6, unit: '°C' },
      { type: 'air_humidity', baseValue: 58, variance: 20, unit: '%' },
      { type: 'wind_speed', baseValue: 3.5, variance: 4, unit: 'm/s' },
      { type: 'wind_direction', baseValue: 180, variance: 90, unit: '°' },
      { type: 'atmospheric_pressure', baseValue: 1013, variance: 10, unit: 'hPa' },
      { type: 'uv_index', baseValue: 5, variance: 4, unit: '' },
    ],
  },
  {
    id: 'irrigation-controller-001',
    farmId: 'demo-farm',
    zoneId: 'zone-north',
    name: 'North Field Irrigation Controller',
    sensors: [
      { type: 'water_flow', baseValue: 15, variance: 5, unit: 'L/min' },
      { type: 'water_pressure', baseValue: 2.5, variance: 0.5, unit: 'bar' },
    ],
  },
];

function generateSensorValue(sensor: SimulatedSensor): number {
  const hour = new Date().getHours();
  let value = sensor.baseValue;

  // Add time-based variations for realistic data
  if (sensor.type === 'air_temperature') {
    value += Math.sin((hour - 6) * Math.PI / 12) * 6; // Peak at noon
  } else if (sensor.type === 'light_intensity') {
    if (hour >= 6 && hour <= 18) {
      value = sensor.baseValue * Math.sin((hour - 6) * Math.PI / 12);
    } else {
      value = 0;
    }
  } else if (sensor.type === 'air_humidity') {
    value -= Math.sin((hour - 6) * Math.PI / 12) * 10; // Inverse of temperature
  }

  // Add random variance
  value += (Math.random() - 0.5) * sensor.variance;

  // Ensure non-negative values where appropriate
  if (['soil_moisture', 'air_humidity', 'light_intensity', 'uv_index', 'water_flow'].includes(sensor.type)) {
    value = Math.max(0, value);
  }

  // Apply max limits
  if (sensor.type === 'soil_moisture' || sensor.type === 'air_humidity') {
    value = Math.min(100, value);
  }

  return Math.round(value * 100) / 100;
}

function generateDeviceTelemetry(device: SimulatedDevice) {
  return {
    deviceId: device.id,
    batteryLevel: 70 + Math.random() * 30,
    signalStrength: 60 + Math.random() * 40,
    uptime: Math.floor(Math.random() * 86400 * 7),
    freeMemory: Math.floor(50000 + Math.random() * 50000),
    temperature: 25 + Math.random() * 10,
  };
}

async function main() {
  const mqttHost = process.env.MQTT_HOST || 'localhost';
  const mqttPort = process.env.MQTT_PORT || '1883';

  console.log(`🚀 IoT Device Simulator Starting...`);
  console.log(`📡 Connecting to MQTT broker at ${mqttHost}:${mqttPort}`);

  const client = mqtt.connect(`mqtt://${mqttHost}:${mqttPort}`, {
    clientId: `simulator-${Date.now()}`,
    reconnectPeriod: 5000,
  });

  client.on('connect', () => {
    console.log('✅ Connected to MQTT broker');
    console.log(`📊 Simulating ${devices.length} devices`);
    console.log('');

    // Send data every 5 seconds
    setInterval(() => {
      devices.forEach((device) => {
        // Send sensor data
        const readings = device.sensors.map((sensor) => ({
          type: sensor.type,
          value: generateSensorValue(sensor),
          unit: sensor.unit,
        }));

        const sensorTopic = `agri-iot/${device.farmId}/sensors/${device.id}/data`;
        client.publish(sensorTopic, JSON.stringify({ readings, timestamp: new Date().toISOString() }));

        console.log(`📤 [${device.name}] Sent ${readings.length} sensor readings`);

        // Send telemetry every other cycle
        if (Math.random() > 0.5) {
          const telemetryTopic = `agri-iot/${device.farmId}/devices/${device.id}/telemetry`;
          client.publish(telemetryTopic, JSON.stringify(generateDeviceTelemetry(device)));
        }
      });

      console.log(`---`);
    }, 5000);

    // Send device status on connect
    devices.forEach((device) => {
      const statusTopic = `agri-iot/${device.farmId}/devices/${device.id}/status`;
      client.publish(statusTopic, JSON.stringify({ status: 'online', timestamp: new Date().toISOString() }));
    });
  });

  client.on('error', (error) => {
    console.error('❌ MQTT Error:', error.message);
  });

  client.on('close', () => {
    console.log('🔌 MQTT connection closed');
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down simulator...');
    devices.forEach((device) => {
      const statusTopic = `agri-iot/${device.farmId}/devices/${device.id}/status`;
      client.publish(statusTopic, JSON.stringify({ status: 'offline', timestamp: new Date().toISOString() }));
    });
    setTimeout(() => {
      client.end();
      process.exit(0);
    }, 1000);
  });
}

main().catch(console.error);
