import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { ListChildrenQueryDto } from './dto/list-children-query.dto';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class ChildrenService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChildDto) {
    const group = await this.prisma.group.findUnique({
      where: { id: dto.groupId },
    });

    if (!group) {
      throw new NotFoundException('Группа не найдена');
    }

    return this.prisma.child.create({
      data: {
        lastName: dto.lastName,
        firstName: dto.firstName,
        middleName: dto.middleName,
        birthDate: dto.birthDate
          ? new Date(dto.birthDate)
          : undefined,
        heightCm: dto.heightCm,
        shoeSize: dto.shoeSize,
        status: dto.status,
        group: {
          connect: { id: dto.groupId },
        },
      },
      include: { group: true },
    });
  }

  findAll(query: ListChildrenQueryDto = {}) {
    return this.prisma.child.findMany({
      where: { groupId: query.groupId, status: query.status },
      include: { group: true },
    });
  }

  async findOne(id: number) {
    const child = await this.prisma.child.findUnique({
      where: { id },
      include: { group: true },
    });
    if (!child) {
      throw new NotFoundException('Ученик не найден');
    }
    return child;
  }

  async update(id: number, dto: UpdateChildDto) {
    const { birthDate, ...fields } = dto;
    try {
      return await this.prisma.child.update({
        where: { id },
        data: {
          ...fields,
          birthDate: typeof birthDate === 'string' ? new Date(birthDate) : birthDate,
        },
        include: { group: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException('Ученик не найден');
        if (error.code === 'P2003') throw new NotFoundException('Группа не найдена');
      }
      throw error;
    }
  }
}
