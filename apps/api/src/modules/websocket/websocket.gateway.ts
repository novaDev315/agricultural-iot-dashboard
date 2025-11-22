import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/ws',
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);
  private userRooms: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.userRooms.delete(client.id);
  }

  @SubscribeMessage('subscribe:farm')
  handleSubscribeFarm(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { farmId: string },
  ) {
    const room = `farm:${data.farmId}`;
    client.join(room);

    if (!this.userRooms.has(client.id)) {
      this.userRooms.set(client.id, new Set());
    }
    this.userRooms.get(client.id)?.add(room);

    this.logger.log(`Client ${client.id} subscribed to farm ${data.farmId}`);
    return { success: true, room };
  }

  @SubscribeMessage('unsubscribe:farm')
  handleUnsubscribeFarm(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { farmId: string },
  ) {
    const room = `farm:${data.farmId}`;
    client.leave(room);
    this.userRooms.get(client.id)?.delete(room);

    this.logger.log(`Client ${client.id} unsubscribed from farm ${data.farmId}`);
    return { success: true };
  }

  @SubscribeMessage('subscribe:zone')
  handleSubscribeZone(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { farmId: string; zoneId: string },
  ) {
    const room = `zone:${data.farmId}:${data.zoneId}`;
    client.join(room);

    if (!this.userRooms.has(client.id)) {
      this.userRooms.set(client.id, new Set());
    }
    this.userRooms.get(client.id)?.add(room);

    return { success: true, room };
  }

  broadcastSensorData(farmId: string, data: Record<string, unknown>) {
    this.server.to(`farm:${farmId}`).emit('sensor:data', data);
  }

  broadcastDeviceStatus(farmId: string, data: Record<string, unknown>) {
    this.server.to(`farm:${farmId}`).emit('device:status', data);
  }

  broadcastAlert(farmId: string, alert: Record<string, unknown>) {
    this.server.to(`farm:${farmId}`).emit('alert:new', alert);
  }

  broadcastIrrigationStatus(farmId: string, data: Record<string, unknown>) {
    this.server.to(`farm:${farmId}`).emit('irrigation:status', data);
  }

  broadcastWeatherUpdate(farmId: string, data: Record<string, unknown>) {
    this.server.to(`farm:${farmId}`).emit('weather:update', data);
  }

  broadcastAutomationEvent(farmId: string, data: Record<string, unknown>) {
    this.server.to(`farm:${farmId}`).emit('automation:event', data);
  }
}
