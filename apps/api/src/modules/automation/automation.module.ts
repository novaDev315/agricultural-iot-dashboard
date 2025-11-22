import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { AutomationRule } from '../../database/entities/automation-rule.entity';
import { FarmsModule } from '../farms/farms.module';
import { IrrigationModule } from '../irrigation/irrigation.module';
import { SensorsModule } from '../sensors/sensors.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AutomationRule]),
    FarmsModule,
    forwardRef(() => IrrigationModule),
    SensorsModule,
    forwardRef(() => WebsocketModule),
  ],
  providers: [AutomationService],
  controllers: [AutomationController],
  exports: [AutomationService],
})
export class AutomationModule {}
