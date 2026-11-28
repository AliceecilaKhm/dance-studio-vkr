import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ChildStatus } from '../../generated/prisma/enums';

export class ListChildrenQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2147483647)
  groupId?: number;

  @IsOptional()
  @IsEnum(ChildStatus)
  status?: ChildStatus;
}
