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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FarmsService } from './farms.service';
import { CreateFarmDto, UpdateFarmDto } from './dto/farm.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('farms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new farm' })
  @ApiResponse({ status: 201, description: 'Farm created successfully' })
  create(@Body() createFarmDto: CreateFarmDto, @Request() req: { user: { id: string } }) {
    return this.farmsService.create(createFarmDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all farms for the current user' })
  @ApiResponse({ status: 200, description: 'List of farms' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.farmsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific farm' })
  @ApiResponse({ status: 200, description: 'Farm details' })
  @ApiResponse({ status: 404, description: 'Farm not found' })
  findOne(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.farmsService.findOne(id, req.user.id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get farm statistics' })
  @ApiResponse({ status: 200, description: 'Farm statistics' })
  getStats(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.farmsService.getStats(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a farm' })
  @ApiResponse({ status: 200, description: 'Farm updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateFarmDto: UpdateFarmDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.farmsService.update(id, updateFarmDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a farm' })
  @ApiResponse({ status: 200, description: 'Farm deleted successfully' })
  remove(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.farmsService.remove(id, req.user.id);
  }
}
