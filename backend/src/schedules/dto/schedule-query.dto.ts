import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Weekday } from '../../generated/prisma/enums';

export class ScheduleQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2147483647)
  groupId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2147483647)
  trainerId?: number;

  @IsOptional()
  @IsEnum(Weekday)
  weekday?: Weekday;
}

export class ScheduleIdDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2147483647)
  id!: number;
}
