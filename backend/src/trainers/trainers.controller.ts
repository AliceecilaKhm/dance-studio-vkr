import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../generated/prisma/enums';


@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Post()
  create(@Body() createTrainerDto: CreateTrainerDto) {
    return this.trainersService.create(createTrainerDto);
  }

  @Get()
  findAll() {
    return this.trainersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trainersService.findOne(id);
  }

  @Put(':trainerId/groups/:groupId')
  @Roles(Role.ADMIN)
  assignGroup(
  @Param('trainerId', ParseIntPipe) trainerId: number,
  @Param('groupId', ParseIntPipe) groupId: number,
  ) {
  return this.trainersService.assignGroup(trainerId, groupId);
  } 

  @Delete(':trainerId/groups/:groupId')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  unassignGroup(
    @Param('trainerId', ParseIntPipe) trainerId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.trainersService.unassignGroup(trainerId, groupId);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number,
         @Body() updateTrainerDto: UpdateTrainerDto) {
    return this.trainersService.update(id, updateTrainerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainersService.remove(+id);
  }
}
