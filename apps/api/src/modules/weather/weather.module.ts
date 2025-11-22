import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { FarmsModule } from '../farms/farms.module';

@Module({
  imports: [FarmsModule],
  providers: [WeatherService],
  controllers: [WeatherController],
  exports: [WeatherService],
})
export class WeatherModule {}
