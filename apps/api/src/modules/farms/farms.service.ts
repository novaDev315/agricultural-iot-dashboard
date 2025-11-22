import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from '../../database/entities/farm.entity';
import { UserFarmAccess } from '../../database/entities/user-farm-access.entity';
import { CreateFarmDto, UpdateFarmDto } from './dto/farm.dto';

@Injectable()
export class FarmsService {
  constructor(
    @InjectRepository(Farm)
    private farmsRepository: Repository<Farm>,
    @InjectRepository(UserFarmAccess)
    private farmAccessRepository: Repository<UserFarmAccess>,
  ) {}

  async create(createFarmDto: CreateFarmDto, userId: string): Promise<Farm> {
    const farm = this.farmsRepository.create({
      ...createFarmDto,
      ownerId: userId,
    });

    return this.farmsRepository.save(farm);
  }

  async findAll(userId: string): Promise<Farm[]> {
    const ownedFarms = await this.farmsRepository.find({
      where: { ownerId: userId },
      relations: ['zones'],
      order: { createdAt: 'DESC' },
    });

    const accessibleFarms = await this.farmAccessRepository.find({
      where: { userId },
      relations: ['farm', 'farm.zones'],
    });

    const allFarms = [
      ...ownedFarms,
      ...accessibleFarms.map((access) => access.farm),
    ];

    return allFarms;
  }

  async findOne(id: string, userId: string): Promise<Farm> {
    const farm = await this.farmsRepository.findOne({
      where: { id },
      relations: ['zones', 'devices', 'owner'],
    });

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    const hasAccess = await this.checkAccess(id, userId);
    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this farm');
    }

    return farm;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto, userId: string): Promise<Farm> {
    const farm = await this.findOne(id, userId);

    if (farm.ownerId !== userId) {
      const access = await this.farmAccessRepository.findOne({
        where: { farmId: id, userId },
      });

      if (!access || !['owner', 'manager'].includes(access.role)) {
        throw new ForbiddenException('Not authorized to update this farm');
      }
    }

    Object.assign(farm, updateFarmDto);
    return this.farmsRepository.save(farm);
  }

  async remove(id: string, userId: string): Promise<void> {
    const farm = await this.findOne(id, userId);

    if (farm.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can delete a farm');
    }

    await this.farmsRepository.remove(farm);
  }

  async checkAccess(farmId: string, userId: string): Promise<boolean> {
    const farm = await this.farmsRepository.findOne({
      where: { id: farmId },
    });

    if (!farm) {
      return false;
    }

    if (farm.ownerId === userId) {
      return true;
    }

    const access = await this.farmAccessRepository.findOne({
      where: { farmId, userId },
    });

    return !!access;
  }

  async getStats(farmId: string, userId: string) {
    await this.findOne(farmId, userId);

    const farm = await this.farmsRepository
      .createQueryBuilder('farm')
      .leftJoinAndSelect('farm.zones', 'zones')
      .leftJoinAndSelect('farm.devices', 'devices')
      .leftJoinAndSelect('farm.alerts', 'alerts', 'alerts.status = :status', { status: 'active' })
      .where('farm.id = :farmId', { farmId })
      .getOne();

    return {
      farmId,
      totalZones: farm?.zones?.length || 0,
      totalDevices: farm?.devices?.length || 0,
      activeAlerts: farm?.alerts?.length || 0,
      onlineDevices: farm?.devices?.filter(d => d.status === 'online').length || 0,
    };
  }
}
