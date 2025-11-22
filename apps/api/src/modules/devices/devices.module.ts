import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { Device } from '../../database/entities/device.entity';
import { FarmsModule } from '../farms/farms.module';

@Module({
  imports: [TypeOrmModule.forFeature([Device]), FarmsModule],
  providers: [DevicesService],
  controllers: [DevicesController],
  exports: [DevicesService],
})
export class DevicesModule {}
