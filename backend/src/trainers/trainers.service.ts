import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class TrainersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createTrainerDto: CreateTrainerDto) {
    return this.prisma.trainer.create({
      data: {
        lastName: createTrainerDto.lastName,
        firstName: createTrainerDto.firstName,
        middleName: createTrainerDto.middleName,
        phone: createTrainerDto.phone,
        specialization: createTrainerDto.specialization,
      },
    });
  }

  findAll() {
    return this.prisma.trainer.findMany({
      include: {
        groups: {
          include: {
            group: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { id: id },
      include: {
        groups: {
          include: {
            group: true,
          },
        },
      },
    });
    if (!trainer) {
      throw new NotFoundException('Тренер не найден');
    }
    return trainer;
  }

  
  async assignGroup(trainerId: number, groupId: number) {
  try {
    await this.prisma.groupTrainer.createMany({
      data: [{ trainerId, groupId }],
      skipDuplicates: true,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new NotFoundException('Тренер или группа не найдены');
    }

    throw error;
  }

  return { trainerId, groupId };
}

  update(id: number, updateTrainerDto: UpdateTrainerDto) {
    return this.prisma.trainer.update({
      where: { id },
      data: {
        ...updateTrainerDto,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} trainer`;
  }
}
