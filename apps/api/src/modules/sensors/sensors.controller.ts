import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SensorsService } from './sensors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('sensors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get('latest')
  @ApiOperation({ summary: 'Get latest sensor readings for a farm' })
  @ApiResponse({ status: 200, description: 'Latest sensor readings' })
  @ApiQuery({ name: 'farmId', required: true })
  getLatestReadings(
    @Query('farmId') farmId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.sensorsService.getLatestReadings(farmId, req.user.id);
  }

  @Get('latest/zone')
  @ApiOperation({ summary: 'Get latest sensor readings for a zone' })
  @ApiResponse({ status: 200, description: 'Latest sensor readings for zone' })
  @ApiQuery({ name: 'farmId', required: true })
  @ApiQuery({ name: 'zoneId', required: true })
  getLatestByZone(
    @Query('farmId') farmId: string,
    @Query('zoneId') zoneId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.sensorsService.getLatestByZone(farmId, zoneId, req.user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get historical sensor data' })
  @ApiResponse({ status: 200, description: 'Historical sensor data' })
  @ApiQuery({ name: 'farmId', required: true })
  @ApiQuery({ name: 'deviceId', required: true })
  @ApiQuery({ name: 'sensorType', required: true })
  @ApiQuery({ name: 'startTime', required: true })
  @ApiQuery({ name: 'endTime', required: true })
  getHistoricalData(
    @Query('farmId') farmId: string,
    @Query('deviceId') deviceId: string,
    @Query('sensorType') sensorType: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.sensorsService.getHistoricalData(
      farmId,
      deviceId,
      sensorType,
      new Date(startTime),
      new Date(endTime),
      req.user.id,
    );
  }

  @Get('aggregated')
  @ApiOperation({ summary: 'Get aggregated sensor data' })
  @ApiResponse({ status: 200, description: 'Aggregated sensor data' })
  @ApiQuery({ name: 'farmId', required: true })
  @ApiQuery({ name: 'sensorType', required: true })
  @ApiQuery({ name: 'period', enum: ['hour', 'day', 'week'], required: true })
  getAggregatedData(
    @Query('farmId') farmId: string,
    @Query('sensorType') sensorType: string,
    @Query('period') period: 'hour' | 'day' | 'week',
    @Request() req: { user: { id: string } },
  ) {
    return this.sensorsService.getAggregatedData(farmId, sensorType, period, req.user.id);
  }
}
