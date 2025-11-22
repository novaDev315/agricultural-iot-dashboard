import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmDto {
  @ApiProperty({ example: 'Green Valley Farm' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Main production farm', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 37.7749 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: -122.4194 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ example: '123 Farm Road, CA', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 250.5 })
  @IsNumber()
  @Min(0)
  areaAcres: number;

  @ApiProperty({ example: 'America/Los_Angeles', required: false })
  @IsOptional()
  @IsString()
  timezone?: string;
}

export class UpdateFarmDto {
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  areaAcres?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
