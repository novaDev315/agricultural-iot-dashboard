import { IsString, IsOptional, IsUUID, IsArray, ValidateNested, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AutomationStatus } from '../../../database/entities/automation-rule.entity';

class TriggerConfigDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  config: Record<string, unknown>;
}

class ConditionConfigDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  config: Record<string, unknown>;
}

class ActionConfigDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  config: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  delay?: number;
}

export class CreateAutomationRuleDto {
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiProperty({ type: [TriggerConfigDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TriggerConfigDto)
  triggers: TriggerConfigDto[];

  @ApiProperty()
  @IsString()
  triggerLogic: 'and' | 'or';

  @ApiProperty({ type: [ConditionConfigDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionConfigDto)
  conditions?: ConditionConfigDto[];

  @ApiProperty({ type: [ActionConfigDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionConfigDto)
  actions: ActionConfigDto[];

  @ApiProperty()
  @IsNumber()
  cooldownMinutes: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxExecutionsPerDay?: number;
}

export class UpdateAutomationRuleDto {
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
  @IsEnum(AutomationStatus)
  status?: AutomationStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  cooldownMinutes?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxExecutionsPerDay?: number;
}
