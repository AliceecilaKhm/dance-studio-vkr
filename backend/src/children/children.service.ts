import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChildDto } from './dto/create-child.dto';

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

  findAll() {
    return this.prisma.child.findMany({
      include: { group: true },
    });
  }
}