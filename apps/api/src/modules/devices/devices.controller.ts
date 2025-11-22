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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { CreateDeviceDto, UpdateDeviceDto } from './dto/device.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('devices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new device' })
  @ApiResponse({ status: 201, description: 'Device registered successfully' })
  create(@Body() createDeviceDto: CreateDeviceDto, @Request() req: { user: { id: string } }) {
    return this.devicesService.create(createDeviceDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all devices for a farm' })
  @ApiResponse({ status: 200, description: 'List of devices' })
  findAll(@Query('farmId') farmId: string, @Request() req: { user: { id: string } }) {
    return this.devicesService.findAllByFarm(farmId, req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get device statistics for a farm' })
  @ApiResponse({ status: 200, description: 'Device statistics' })
  getStats(@Query('farmId') farmId: string, @Request() req: { user: { id: string } }) {
    return this.devicesService.getDeviceStats(farmId, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific device' })
  @ApiResponse({ status: 200, description: 'Device details' })
  findOne(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.devicesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a device' })
  @ApiResponse({ status: 200, description: 'Device updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.devicesService.update(id, updateDeviceDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a device' })
  @ApiResponse({ status: 200, description: 'Device deleted successfully' })
  remove(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.devicesService.remove(id, req.user.id);
  }
}
