import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('weather')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current weather for a farm' })
  @ApiResponse({ status: 200, description: 'Current weather data' })
  @ApiQuery({ name: 'farmId', required: true })
  getCurrentWeather(
    @Query('farmId') farmId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.weatherService.getCurrentWeather(farmId, req.user.id);
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Get weather forecast for a farm' })
  @ApiResponse({ status: 200, description: 'Weather forecast' })
  @ApiQuery({ name: 'farmId', required: true })
  getForecast(
    @Query('farmId') farmId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.weatherService.getForecast(farmId, req.user.id);
  }

  @Get('gdd')
  @ApiOperation({ summary: 'Get growing degree days' })
  @ApiResponse({ status: 200, description: 'Growing degree days data' })
  @ApiQuery({ name: 'farmId', required: true })
  @ApiQuery({ name: 'baseTemp', required: false })
  getGrowingDegreeDays(
    @Query('farmId') farmId: string,
    @Query('baseTemp') baseTemp: number,
    @Request() req: { user: { id: string } },
  ) {
    return this.weatherService.getGrowingDegreeDays(farmId, req.user.id, baseTemp || 10);
  }
}
