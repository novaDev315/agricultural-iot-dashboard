import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AutomationService } from './automation.service';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('automation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post('rules')
  @ApiOperation({ summary: 'Create automation rule' })
  @ApiResponse({ status: 201, description: 'Rule created' })
  create(
    @Body() dto: CreateAutomationRuleDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.automationService.create(dto, req.user.id);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get all automation rules for a farm' })
  @ApiResponse({ status: 200, description: 'List of rules' })
  @ApiQuery({ name: 'farmId', required: true })
  findAll(
    @Query('farmId') farmId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.automationService.findAllByFarm(farmId, req.user.id);
  }

  @Get('rules/:id')
  @ApiOperation({ summary: 'Get automation rule details' })
  @ApiResponse({ status: 200, description: 'Rule details' })
  findOne(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.automationService.findOne(id, req.user.id);
  }

  @Patch('rules/:id')
  @ApiOperation({ summary: 'Update automation rule' })
  @ApiResponse({ status: 200, description: 'Rule updated' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAutomationRuleDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.automationService.update(id, dto, req.user.id);
  }

  @Patch('rules/:id/toggle')
  @ApiOperation({ summary: 'Toggle automation rule status' })
  @ApiResponse({ status: 200, description: 'Rule toggled' })
  toggle(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.automationService.toggleRule(id, req.user.id);
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: 'Delete automation rule' })
  @ApiResponse({ status: 200, description: 'Rule deleted' })
  remove(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.automationService.remove(id, req.user.id);
  }
}
