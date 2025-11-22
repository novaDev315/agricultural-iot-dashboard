import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { FarmsModule } from '../farms/farms.module';
import { SensorsModule } from '../sensors/sensors.module';
import { IrrigationModule } from '../irrigation/irrigation.module';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [FarmsModule, SensorsModule, IrrigationModule, AlertsModule],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
