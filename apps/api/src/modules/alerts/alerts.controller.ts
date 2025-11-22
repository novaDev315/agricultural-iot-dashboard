import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { CreateAlertRuleDto, UpdateAlertDto } from './dto/alert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AlertStatus } from '../../database/entities/alert.entity';

@ApiTags('alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all alerts for a farm' })
  @ApiResponse({ status: 200, description: 'List of alerts' })
  @ApiQuery({ name: 'farmId', required: true })
  @ApiQuery({ name: 'status', required: false, enum: AlertStatus })
  findAll(
    @Query('farmId') farmId: string,
    @Query('status') status: AlertStatus,
    @Request() req: { user: { id: string } },
  ) {
    return this.alertsService.findAllByFarm(farmId, req.user.id, status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get alert statistics' })
  @ApiResponse({ status: 200, description: 'Alert statistics' })
  @ApiQuery({ name: 'farmId', required: true })
  getStats(
    @Query('farmId') farmId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.alertsService.getAlertStats(farmId, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get alert details' })
  @ApiResponse({ status: 200, description: 'Alert details' })
  findOne(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.alertsService.findOne(id, req.user.id);
  }

  @Patch(':id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge alert' })
  @ApiResponse({ status: 200, description: 'Alert acknowledged' })
  acknowledge(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.alertsService.acknowledgeAlert(id, req.user.id);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolve alert' })
  @ApiResponse({ status: 200, description: 'Alert resolved' })
  resolve(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.alertsService.resolveAlert(id, req.user.id);
  }

  @Patch(':id/snooze')
  @ApiOperation({ summary: 'Snooze alert' })
  @ApiResponse({ status: 200, description: 'Alert snoozed' })
  snooze(
    @Param('id') id: string,
    @Body() body: { minutes: number },
    @Request() req: { user: { id: string } },
  ) {
    return this.alertsService.snoozeAlert(id, req.user.id, body.minutes);
  }

  // Alert Rules
  @Post('rules')
  @ApiOperation({ summary: 'Create alert rule' })
  @ApiResponse({ status: 201, description: 'Rule created' })
  createRule(
    @Body() dto: CreateAlertRuleDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.alertsService.createRule(dto, req.user.id);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get alert rules' })
  @ApiResponse({ status: 200, description: 'List of rules' })
  @ApiQuery({ name: 'farmId', required: true })
  getRules(
    @Query('farmId') farmId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.alertsService.findRulesByFarm(farmId, req.user.id);
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: 'Delete alert rule' })
  @ApiResponse({ status: 200, description: 'Rule deleted' })
  deleteRule(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.alertsService.deleteRule(id, req.user.id);
  }
}
