import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';

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
}