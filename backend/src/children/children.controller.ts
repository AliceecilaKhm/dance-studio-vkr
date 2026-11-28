import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { ListChildrenQueryDto } from './dto/list-children-query.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../generated/prisma/enums';

@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateChildDto) {
    return this.childrenService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListChildrenQueryDto) {
    return this.childrenService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.childrenService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateChildDto) {
    return this.childrenService.update(id, dto);
  }
}
