import { IsString, IsNumber, IsOptional, IsUUID, IsArray, IsEnum, Min, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IrrigationType } from '../../../database/entities/irrigation-system.entity';

export class CreateIrrigationSystemDto {
  @ApiProperty()
  @IsUUID()
  farmId: string;

  @ApiProperty()
  @IsUUID()
  zoneId: string;

  @ApiProperty({ example: 'North Field Drip System' })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'irrigation-controller-001' })
  @IsString()
  deviceId: string;

  @ApiProperty({ enum: IrrigationType })
  @IsEnum(IrrigationType)
  type: IrrigationType;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  valveCount: number;

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  @Min(0)
  flowRatePerMinute: number;

  @ApiProperty({ example: 120 })
  @IsNumber()
  @Min(1)
  maxDuration: number;
}

export class IrrigationCommandDto {
  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  valves?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class CreateScheduleDto {
  @ApiProperty()
  @IsUUID()
  systemId: string;

  @ApiProperty({ example: 'Morning Irrigation' })
  @IsString()
  name: string;

  @ApiProperty({ example: '06:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: [1, 3, 5], description: 'Days of week (0=Sunday)' })
  @IsArray()
  @IsNumber({}, { each: true })
  daysOfWeek: number[];

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  skipWeather?: boolean;
}
