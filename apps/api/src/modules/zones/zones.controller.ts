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
import { ZonesService } from './zones.service';
import { CreateZoneDto, UpdateZoneDto } from './dto/zone.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('zones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new zone' })
  @ApiResponse({ status: 201, description: 'Zone created successfully' })
  create(@Body() createZoneDto: CreateZoneDto, @Request() req: { user: { id: string } }) {
    return this.zonesService.create(createZoneDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all zones for a farm' })
  @ApiResponse({ status: 200, description: 'List of zones' })
  findAll(@Query('farmId') farmId: string, @Request() req: { user: { id: string } }) {
    return this.zonesService.findAllByFarm(farmId, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific zone' })
  @ApiResponse({ status: 200, description: 'Zone details' })
  findOne(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.zonesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a zone' })
  @ApiResponse({ status: 200, description: 'Zone updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateZoneDto: UpdateZoneDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.zonesService.update(id, updateZoneDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a zone' })
  @ApiResponse({ status: 200, description: 'Zone deleted successfully' })
  remove(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.zonesService.remove(id, req.user.id);
  }
}
