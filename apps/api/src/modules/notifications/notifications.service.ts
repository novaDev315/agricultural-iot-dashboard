import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  channels: ('email' | 'sms' | 'push' | 'websocket')[];
  data?: Record<string, unknown>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  digestFrequency: 'realtime' | 'hourly' | 'daily';
}

interface QueuedNotification {
  payload: NotificationPayload;
  scheduledFor: Date;
  retryCount: number;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private notificationQueue: Map<string, QueuedNotification[]> = new Map();
  private userPreferences: Map<string, NotificationPreferences> = new Map();

  constructor(private readonly eventEmitter: EventEmitter2) {
    // Set up periodic digest processing
    setInterval(() => this.processDigests(), 60000); // Check every minute
  }

  async send(payload: NotificationPayload): Promise<void> {
    const preferences = this.getUserPreferences(payload.userId);

    // Check quiet hours
    if (this.isQuietHours(preferences) && payload.priority !== 'urgent') {
      this.queueForLater(payload);
      return;
    }

    // Process each channel
    for (const channel of payload.channels) {
      await this.sendToChannel(channel, payload, preferences);
    }

    // Emit event for logging/analytics
    this.eventEmitter.emit('notification.sent', {
      userId: payload.userId,
      type: payload.type,
      channels: payload.channels,
      timestamp: new Date(),
    });
  }

  private async sendToChannel(
    channel: string,
    payload: NotificationPayload,
    preferences: NotificationPreferences,
  ): Promise<void> {
    switch (channel) {
      case 'email':
        if (preferences.emailEnabled) {
          await this.sendEmail(payload);
        }
        break;
      case 'sms':
        if (preferences.smsEnabled) {
          await this.sendSms(payload);
        }
        break;
      case 'push':
        if (preferences.pushEnabled) {
          await this.sendPush(payload);
        }
        break;
      case 'websocket':
        await this.sendWebSocket(payload);
        break;
    }
  }

  private async sendEmail(payload: NotificationPayload): Promise<void> {
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    this.logger.log(`[EMAIL] To: ${payload.userId} - ${payload.title}: ${payload.message}`);

    // Simulate email sending
    // await this.emailService.send({
    //   to: user.email,
    //   subject: payload.title,
    //   html: this.formatEmailTemplate(payload),
    // });
  }

  private async sendSms(payload: NotificationPayload): Promise<void> {
    // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
    this.logger.log(`[SMS] To: ${payload.userId} - ${payload.message}`);

    // Simulate SMS sending
    // await this.twilioClient.messages.create({
    //   body: payload.message,
    //   to: user.phone,
    //   from: process.env.TWILIO_PHONE,
    // });
  }

  private async sendPush(payload: NotificationPayload): Promise<void> {
    // In production, integrate with push notification service (Firebase, OneSignal, etc.)
    this.logger.log(`[PUSH] To: ${payload.userId} - ${payload.title}`);

    // Simulate push notification
    // await this.firebaseAdmin.messaging().send({
    //   token: userDeviceToken,
    //   notification: {
    //     title: payload.title,
    //     body: payload.message,
    //   },
    //   data: payload.data,
    // });
  }

  private async sendWebSocket(payload: NotificationPayload): Promise<void> {
    // Emit WebSocket event
    this.eventEmitter.emit('websocket.notification', {
      userId: payload.userId,
      notification: {
        id: Date.now().toString(),
        title: payload.title,
        message: payload.message,
        type: payload.type,
        timestamp: new Date(),
        data: payload.data,
      },
    });
  }

  @OnEvent('alert.created')
  async handleAlertCreated(event: { alert: unknown; userId: string }): Promise<void> {
    const alert = event.alert as { title: string; message: string; severity: string };

    await this.send({
      userId: event.userId,
      title: alert.title,
      message: alert.message,
      type: alert.severity === 'critical' || alert.severity === 'emergency' ? 'alert' : 'warning',
      channels: alert.severity === 'emergency'
        ? ['email', 'sms', 'push', 'websocket']
        : ['push', 'websocket'],
      priority: alert.severity === 'emergency' ? 'urgent' : 'normal',
      data: { alert },
    });
  }

  @OnEvent('irrigation.started')
  async handleIrrigationStarted(event: { zone: string; userId: string }): Promise<void> {
    await this.send({
      userId: event.userId,
      title: 'Irrigation Started',
      message: `Irrigation has started in ${event.zone}`,
      type: 'info',
      channels: ['websocket'],
      priority: 'low',
    });
  }

  @OnEvent('device.offline')
  async handleDeviceOffline(event: { device: unknown; userId: string }): Promise<void> {
    const device = event.device as { name: string; deviceId: string };

    await this.send({
      userId: event.userId,
      title: 'Device Offline',
      message: `${device.name} (${device.deviceId}) has gone offline`,
      type: 'warning',
      channels: ['push', 'websocket'],
      priority: 'normal',
      data: { device },
    });
  }

  getUserPreferences(userId: string): NotificationPreferences {
    return this.userPreferences.get(userId) || {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      digestFrequency: 'realtime',
    };
  }

  setUserPreferences(userId: string, preferences: Partial<NotificationPreferences>): void {
    const current = this.getUserPreferences(userId);
    this.userPreferences.set(userId, { ...current, ...preferences });
  }

  private isQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.quietHoursStart || !preferences.quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    return currentTime >= preferences.quietHoursStart && currentTime <= preferences.quietHoursEnd;
  }

  private queueForLater(payload: NotificationPayload): void {
    const preferences = this.getUserPreferences(payload.userId);
    const endTime = preferences.quietHoursEnd || '06:00';

    const now = new Date();
    const [hours, minutes] = endTime.split(':').map(Number);
    const scheduledFor = new Date(now);
    scheduledFor.setHours(hours, minutes, 0, 0);

    if (scheduledFor <= now) {
      scheduledFor.setDate(scheduledFor.getDate() + 1);
    }

    const queue = this.notificationQueue.get(payload.userId) || [];
    queue.push({ payload, scheduledFor, retryCount: 0 });
    this.notificationQueue.set(payload.userId, queue);

    this.logger.log(`Notification queued for ${payload.userId} until ${scheduledFor.toISOString()}`);
  }

  private async processDigests(): Promise<void> {
    const now = new Date();

    for (const [userId, queue] of this.notificationQueue.entries()) {
      const readyNotifications = queue.filter(n => n.scheduledFor <= now);

      if (readyNotifications.length > 0) {
        for (const notification of readyNotifications) {
          await this.send(notification.payload);
        }

        // Remove processed notifications
        this.notificationQueue.set(
          userId,
          queue.filter(n => n.scheduledFor > now),
        );
      }
    }
  }
}
