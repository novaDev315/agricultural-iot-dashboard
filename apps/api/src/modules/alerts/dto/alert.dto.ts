import { IsString, IsEnum, IsOptional, IsUUID, IsArray, ValidateNested, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AlertSeverity, AlertType } from '../../../database/entities/alert.entity';

export class CreateAlertDto {
  @ApiProperty()
  @IsUUID()
  farmId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiProperty({ enum: AlertType })
  @IsEnum(AlertType)
  type: AlertType;

  @ApiProperty({ enum: AlertSeverity })
  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty({ required: false })
  @IsOptional()
  data?: Record<string, unknown>;
}

export class UpdateAlertDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

class AlertConditionDto {
  @ApiProperty()
  @IsString()
  type: 'sensor' | 'device' | 'weather' | 'time';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sensorType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiProperty()
  @IsString()
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between' | 'outside';

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxValue?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;
}

class AlertNotificationDto {
  @ApiProperty()
  @IsString()
  channel: 'email' | 'sms' | 'push' | 'slack' | 'webhook';

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  template?: string;

  @ApiProperty()
  @IsBoolean()
  enabled: boolean;
}

export class CreateAlertRuleDto {
  @ApiProperty()
  @IsUUID()
  farmId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [AlertConditionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlertConditionDto)
  conditions: AlertConditionDto[];

  @ApiProperty()
  @IsString()
  conditionLogic: 'and' | 'or';

  @ApiProperty({ enum: AlertSeverity })
  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @ApiProperty()
  @IsNumber()
  cooldownMinutes: number;

  @ApiProperty({ type: [AlertNotificationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlertNotificationDto)
  notifications: AlertNotificationDto[];
}
