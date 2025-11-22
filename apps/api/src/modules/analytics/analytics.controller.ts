import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard summary' })
  @ApiResponse({ status: 200, description: 'Dashboard summary data' })
  @ApiQuery({ name: 'farmId', required: true })
  getDashboardSummary(
    @Query('farmId') farmId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.analyticsService.getDashboardSummary(farmId, req.user.id);
  }

  @Get('resources')
  @ApiOperation({ summary: 'Get resource usage analytics' })
  @ApiResponse({ status: 200, description: 'Resource usage data' })
  @ApiQuery({ name: 'farmId', required: true })
  @ApiQuery({ name: 'period', enum: ['day', 'week', 'month'], required: true })
  getResourceUsage(
    @Query('farmId') farmId: string,
    @Query('period') period: 'day' | 'week' | 'month',
    @Request() req: { user: { id: string } },
  ) {
    return this.analyticsService.getResourceUsage(farmId, req.user.id, period);
  }

  @Get('crop-health')
  @ApiOperation({ summary: 'Get crop health metrics' })
  @ApiResponse({ status: 200, description: 'Crop health data' })
  @ApiQuery({ name: 'farmId', required: true })
  @ApiQuery({ name: 'zoneId', required: true })
  getCropHealth(
    @Query('farmId') farmId: string,
    @Query('zoneId') zoneId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.analyticsService.getCropHealthMetrics(farmId, zoneId, req.user.id);
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get farm performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance data' })
  @ApiQuery({ name: 'farmId', required: true })
  @ApiQuery({ name: 'period', enum: ['week', 'month', 'season'], required: true })
  getPerformance(
    @Query('farmId') farmId: string,
    @Query('period') period: 'week' | 'month' | 'season',
    @Request() req: { user: { id: string } },
  ) {
    return this.analyticsService.getFarmPerformance(farmId, req.user.id, period);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export data' })
  @ApiResponse({ status: 200, description: 'Exported data' })
  @ApiQuery({ name: 'farmId', required: true })
  @ApiQuery({ name: 'dataType', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiQuery({ name: 'format', enum: ['csv', 'json'], required: true })
  exportData(
    @Query('farmId') farmId: string,
    @Query('dataType') dataType: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('format') format: 'csv' | 'json',
    @Request() req: { user: { id: string } },
  ) {
    return this.analyticsService.exportData(
      farmId,
      req.user.id,
      dataType,
      new Date(startDate),
      new Date(endDate),
      format,
    );
  }
}
