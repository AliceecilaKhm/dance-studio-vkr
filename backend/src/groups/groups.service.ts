import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateGroupDto) {
    return this.prisma.group.create({
      data: {
        name: dto.name,
        status: dto.status,
      },
    });
  }

  findAll() {
    return this.prisma.group.findMany({
      include: { children: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!group) {
      throw new NotFoundException('Группа не найдена');
    }

    return group;
  }

  async update(id: number, dto: UpdateGroupDto) {
    try {
      return await this.prisma.group.update({
        where: { id },
        data: { name: dto.name, status: dto.status },
        include: { children: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Группа не найдена');
      }
      throw error;
    }
  }
}
