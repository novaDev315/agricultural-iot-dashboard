import { IsString, IsNumber, IsOptional, IsUUID, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CoordinateDto {
  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;
}

class PolygonDto {
  @ApiProperty({ type: [CoordinateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoordinateDto)
  coordinates: CoordinateDto[];
}

export class CreateZoneDto {
  @ApiProperty()
  @IsUUID()
  farmId: string;

  @ApiProperty({ example: 'North Field' })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PolygonDto)
  polygon?: PolygonDto;

  @ApiProperty({ example: 25.5 })
  @IsNumber()
  @Min(0)
  areaAcres: number;

  @ApiProperty({ example: 'corn', required: false })
  @IsOptional()
  @IsString()
  cropType?: string;

  @ApiProperty({ example: 'loamy', required: false })
  @IsOptional()
  @IsString()
  soilType?: string;

  @ApiProperty({ example: '#4CAF50', required: false })
  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateZoneDto {
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
  @ValidateNested()
  @Type(() => PolygonDto)
  polygon?: PolygonDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  areaAcres?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cropType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  soilType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  color?: string;
}
