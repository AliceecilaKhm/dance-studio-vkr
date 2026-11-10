import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ChildStatus } from '../../generated/prisma/enums';

export class CreateChildDto {
  @IsInt()
  @Min(1)
  groupId!: number;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsInt()
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  shoeSize?: number;

  @IsOptional()
  @IsEnum(ChildStatus)
  status?: ChildStatus;
}