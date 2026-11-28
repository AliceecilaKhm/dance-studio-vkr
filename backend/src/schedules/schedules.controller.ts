import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query,
} from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../generated/prisma/enums';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleIdDto, ScheduleQueryDto } from './dto/schedule-query.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedules: SchedulesService) {}

  @Get()
  list(@Query() query: ScheduleQueryDto) {
    return this.schedules.list(query);
  }

  @Get(':id')
  findOne(@Param() params: ScheduleIdDto) {
    return this.schedules.findOne(params.id);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateScheduleDto) {
    return this.schedules.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param() params: ScheduleIdDto, @Body() dto: UpdateScheduleDto) {
    return this.schedules.update(params.id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: ScheduleIdDto) {
    return this.schedules.remove(params.id);
  }
}
