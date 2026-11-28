import { IsEnum, IsInt, Matches, Max, Min } from 'class-validator';
import { Weekday } from '../../generated/prisma/enums';

export class CreateScheduleDto {
  @IsInt()
  @Min(1)
  @Max(2147483647)
  groupId!: number;

  @IsInt()
  @Min(1)
  @Max(2147483647)
  trainerId!: number;

  @IsEnum(Weekday)
  weekday!: Weekday;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'Укажите время начала в формате ЧЧ:ММ, например 09:30',
  })
  startTime!: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'Укажите время окончания в формате ЧЧ:ММ, например 11:00',
  })
  endTime!: string;
}
