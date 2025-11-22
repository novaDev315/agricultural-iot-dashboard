import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonesService } from './zones.service';
import { ZonesController } from './zones.controller';
import { Zone } from '../../database/entities/zone.entity';
import { FarmsModule } from '../farms/farms.module';

@Module({
  imports: [TypeOrmModule.forFeature([Zone]), FarmsModule],
  providers: [ZonesService],
  controllers: [ZonesController],
  exports: [ZonesService],
})
export class ZonesModule {}
