import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { GroupStatus } from '../../generated/prisma/enums';

export class UpdateGroupDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(GroupStatus)
  status?: GroupStatus;
}
