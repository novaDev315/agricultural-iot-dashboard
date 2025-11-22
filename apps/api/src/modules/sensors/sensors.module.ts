import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { DevicesModule } from '../devices/devices.module';
import { FarmsModule } from '../farms/farms.module';

@Module({
  imports: [DevicesModule, FarmsModule],
  providers: [SensorsService],
  controllers: [SensorsController],
  exports: [SensorsService],
})
export class SensorsModule {}
