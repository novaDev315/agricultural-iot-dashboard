import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmsService } from './farms.service';
import { FarmsController } from './farms.controller';
import { Farm } from '../../database/entities/farm.entity';
import { UserFarmAccess } from '../../database/entities/user-farm-access.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, UserFarmAccess])],
  providers: [FarmsService],
  controllers: [FarmsController],
  exports: [FarmsService],
})
export class FarmsModule {}
