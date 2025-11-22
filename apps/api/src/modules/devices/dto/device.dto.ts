import { IsString, IsEnum, IsOptional, IsUUID, IsNumber, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DeviceType, ConnectionType } from '../../../database/entities/device.entity';

class DeviceSensorDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateDeviceDto {
  @ApiProperty()
  @IsUUID()
  farmId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @ApiProperty({ example: 'AA:BB:CC:DD:EE:FF' })
  @IsString()
  deviceId: string;

  @ApiProperty({ example: 'Soil Sensor Node 1' })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DeviceType })
  @IsEnum(DeviceType)
  type: DeviceType;

  @ApiProperty({ enum: ConnectionType })
  @IsEnum(ConnectionType)
  connectionType: ConnectionType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({ type: [DeviceSensorDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeviceSensorDto)
  sensors?: DeviceSensorDto[];
}

export class UpdateDeviceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firmwareVersion?: string;
}
