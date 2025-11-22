import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { FarmsModule } from './modules/farms/farms.module';
import { ZonesModule } from './modules/zones/zones.module';
import { DevicesModule } from './modules/devices/devices.module';
import { SensorsModule } from './modules/sensors/sensors.module';
import { IrrigationModule } from './modules/irrigation/irrigation.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { AutomationModule } from './modules/automation/automation.module';
import { WeatherModule } from './modules/weather/weather.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { WebsocketModule } from './modules/websocket/websocket.module';

// Configuration
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
      }),
      inject: [ConfigService],
    }),

    // Scheduler for cron jobs
    ScheduleModule.forRoot(),

    // Feature modules
    AuthModule,
    FarmsModule,
    ZonesModule,
    DevicesModule,
    SensorsModule,
    IrrigationModule,
    AlertsModule,
    AutomationModule,
    WeatherModule,
    AnalyticsModule,
    MqttModule,
    WebsocketModule,
  ],
})
export class AppModule {}
