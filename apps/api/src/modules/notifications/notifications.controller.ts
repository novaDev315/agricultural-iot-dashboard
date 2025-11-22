import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { NotificationsService, NotificationPreferences } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('preferences/:userId')
  getPreferences(@Param('userId') userId: string): NotificationPreferences {
    return this.notificationsService.getUserPreferences(userId);
  }

  @Put('preferences/:userId')
  updatePreferences(
    @Param('userId') userId: string,
    @Body() preferences: Partial<NotificationPreferences>,
  ): { success: boolean } {
    this.notificationsService.setUserPreferences(userId, preferences);
    return { success: true };
  }

  @Post('send')
  async sendNotification(
    @Body() payload: {
      userId: string;
      title: string;
      message: string;
      type: 'alert' | 'info' | 'warning' | 'success';
      channels: ('email' | 'sms' | 'push' | 'websocket')[];
    },
  ): Promise<{ success: boolean }> {
    await this.notificationsService.send(payload);
    return { success: true };
  }

  @Post('test/:userId')
  async sendTestNotification(@Param('userId') userId: string): Promise<{ success: boolean }> {
    await this.notificationsService.send({
      userId,
      title: 'Test Notification',
      message: 'This is a test notification from the Agricultural IoT Dashboard',
      type: 'info',
      channels: ['websocket', 'push'],
    });
    return { success: true };
  }
}
