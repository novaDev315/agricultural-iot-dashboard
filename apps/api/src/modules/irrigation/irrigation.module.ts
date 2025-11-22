import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrrigationService } from './irrigation.service';
import { IrrigationController } from './irrigation.controller';
import { IrrigationSystem } from '../../database/entities/irrigation-system.entity';
import { IrrigationSchedule } from '../../database/entities/irrigation-schedule.entity';
import { IrrigationEvent } from '../../database/entities/irrigation-event.entity';
import { FarmsModule } from '../farms/farms.module';
import { MqttModule } from '../mqtt/mqtt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IrrigationSystem, IrrigationSchedule, IrrigationEvent]),
    FarmsModule,
    forwardRef(() => MqttModule),
  ],
  providers: [IrrigationService],
  controllers: [IrrigationController],
  exports: [IrrigationService],
})
export class IrrigationModule {}
