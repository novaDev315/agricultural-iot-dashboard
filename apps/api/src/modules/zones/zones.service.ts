import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from '../../database/entities/zone.entity';
import { FarmsService } from '../farms/farms.service';
import { CreateZoneDto, UpdateZoneDto } from './dto/zone.dto';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone)
    private zonesRepository: Repository<Zone>,
    private farmsService: FarmsService,
  ) {}

  async create(createZoneDto: CreateZoneDto, userId: string): Promise<Zone> {
    await this.farmsService.findOne(createZoneDto.farmId, userId);

    const zone = this.zonesRepository.create(createZoneDto);
    return this.zonesRepository.save(zone);
  }

  async findAllByFarm(farmId: string, userId: string): Promise<Zone[]> {
    await this.farmsService.findOne(farmId, userId);

    return this.zonesRepository.find({
      where: { farmId },
      relations: ['devices', 'irrigationSystem'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Zone> {
    const zone = await this.zonesRepository.findOne({
      where: { id },
      relations: ['farm', 'devices', 'irrigationSystem'],
    });

    if (!zone) {
      throw new NotFoundException('Zone not found');
    }

    await this.farmsService.findOne(zone.farmId, userId);

    return zone;
  }

  async update(id: string, updateZoneDto: UpdateZoneDto, userId: string): Promise<Zone> {
    const zone = await this.findOne(id, userId);
    Object.assign(zone, updateZoneDto);
    return this.zonesRepository.save(zone);
  }

  async remove(id: string, userId: string): Promise<void> {
    const zone = await this.findOne(id, userId);
    await this.zonesRepository.remove(zone);
  }
}
