import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GroupStatus } from '../../generated/prisma/enums';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsEnum(GroupStatus)
  status?: GroupStatus;

}
