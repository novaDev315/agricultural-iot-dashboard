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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IrrigationService } from './irrigation.service';
import { CreateIrrigationSystemDto, CreateScheduleDto, IrrigationCommandDto } from './dto/irrigation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('irrigation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('irrigation')
export class IrrigationController {
  constructor(private readonly irrigationService: IrrigationService) {}

  @Post('systems')
  @ApiOperation({ summary: 'Create irrigation system' })
  @ApiResponse({ status: 201, description: 'System created successfully' })
  createSystem(
    @Body() dto: CreateIrrigationSystemDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.irrigationService.createSystem(dto, req.user.id);
  }

  @Get('systems')
  @ApiOperation({ summary: 'Get all irrigation systems for a farm' })
  @ApiResponse({ status: 200, description: 'List of irrigation systems' })
  @ApiQuery({ name: 'farmId', required: true })
  findAllSystems(
    @Query('farmId') farmId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.irrigationService.findAllSystems(farmId, req.user.id);
  }

  @Get('systems/:id')
  @ApiOperation({ summary: 'Get irrigation system details' })
  @ApiResponse({ status: 200, description: 'System details' })
  findSystem(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.irrigationService.findSystem(id, req.user.id);
  }

  @Post('systems/:id/start')
  @ApiOperation({ summary: 'Start irrigation' })
  @ApiResponse({ status: 200, description: 'Irrigation started' })
  startIrrigation(
    @Param('id') id: string,
    @Body() command: IrrigationCommandDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.irrigationService.startIrrigation(id, command, req.user.id);
  }

  @Post('systems/:id/stop')
  @ApiOperation({ summary: 'Stop irrigation' })
  @ApiResponse({ status: 200, description: 'Irrigation stopped' })
  stopIrrigation(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.irrigationService.stopIrrigation(id, req.user.id);
  }

  @Post('schedules')
  @ApiOperation({ summary: 'Create irrigation schedule' })
  @ApiResponse({ status: 201, description: 'Schedule created' })
  createSchedule(
    @Body() dto: CreateScheduleDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.irrigationService.createSchedule(dto, req.user.id);
  }

  @Get('systems/:id/schedules')
  @ApiOperation({ summary: 'Get schedules for a system' })
  @ApiResponse({ status: 200, description: 'List of schedules' })
  getSchedules(
    @Param('id') systemId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.irrigationService.getSchedules(systemId, req.user.id);
  }

  @Delete('schedules/:id')
  @ApiOperation({ summary: 'Delete schedule' })
  @ApiResponse({ status: 200, description: 'Schedule deleted' })
  deleteSchedule(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.irrigationService.deleteSchedule(id, req.user.id);
  }

  @Get('systems/:id/events')
  @ApiOperation({ summary: 'Get irrigation events' })
  @ApiResponse({ status: 200, description: 'List of events' })
  getEvents(
    @Param('id') systemId: string,
    @Query('limit') limit: number,
    @Request() req: { user: { id: string } },
  ) {
    return this.irrigationService.getEvents(systemId, req.user.id, limit);
  }

  @Get('water-usage')
  @ApiOperation({ summary: 'Get water usage statistics' })
  @ApiResponse({ status: 200, description: 'Water usage stats' })
  @ApiQuery({ name: 'farmId', required: true })
  getWaterUsage(
    @Query('farmId') farmId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.irrigationService.getWaterUsageStats(farmId, req.user.id);
  }
}
