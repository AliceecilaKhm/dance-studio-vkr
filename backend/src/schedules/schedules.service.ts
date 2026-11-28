import {
  BadRequestException, ConflictException, Injectable, NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleQueryDto } from './dto/schedule-query.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

const includeNames = {
  group: { select: { id: true, name: true } },
  trainer: { select: { id: true, lastName: true, firstName: true, middleName: true } },
} as const;

function presentSchedule(row: Prisma.ScheduleGetPayload<{ include: typeof includeNames }>) {
  return {
    ...row,
    startTime: row.startTime.toISOString().slice(11, 16),
    endTime: row.endTime.toISOString().slice(11, 16),
  };
}

function isWriteConflict(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
    return true;
  }
  // The PostgreSQL adapter can report a serialization failure directly at COMMIT.
  const cause = error instanceof Error ? error.cause : undefined;
  return typeof cause === 'object' && cause !== null &&
    'kind' in cause && cause.kind === 'TransactionWriteConflict';
}

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async list({ groupId, trainerId, weekday }: ScheduleQueryDto) {
    const rows = await this.prisma.schedule.findMany({
      where: { groupId, trainerId, weekday },
      orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }, { id: 'asc' }],
      include: includeNames,
    });
    return rows.map(presentSchedule);
  }

  async findOne(id: number) {
    const row = await this.prisma.schedule.findUnique({ where: { id }, include: includeNames });
    if (!row) throw new NotFoundException('Запись расписания не найдена');
    return presentSchedule(row);
  }

  create(dto: CreateScheduleDto) {
    return this.writeSchedule(async (tx) => {
      const data = await this.validateSlot(tx, dto);
      return presentSchedule(await tx.schedule.create({ data, include: includeNames }));
    });
  }

  update(id: number, dto: UpdateScheduleDto) {
    if (Object.values(dto).every((value) => value === undefined)) {
      throw new BadRequestException('Передайте хотя бы одно поле для изменения');
    }
    return this.writeSchedule(async (tx) => {
      const row = await tx.schedule.findUnique({ where: { id }, include: includeNames });
      if (!row) throw new NotFoundException('Запись расписания не найдена');
      const current = presentSchedule(row);
      const data = await this.validateSlot(tx, {
        groupId: dto.groupId ?? current.groupId,
        trainerId: dto.trainerId ?? current.trainerId,
        weekday: dto.weekday ?? current.weekday,
        startTime: dto.startTime ?? current.startTime,
        endTime: dto.endTime ?? current.endTime,
      }, id);
      return presentSchedule(await tx.schedule.update({ where: { id }, data, include: includeNames }));
    });
  }

  async remove(id: number) {
    const { count } = await this.prisma.schedule.deleteMany({ where: { id } });
    if (!count) throw new NotFoundException('Запись расписания не найдена');
  }

  private async validateSlot(tx: Prisma.TransactionClient, slot: CreateScheduleDto, id?: number) {
    const { groupId, trainerId, weekday } = slot;
    if (slot.startTime >= slot.endTime) {
      throw new BadRequestException('Окончание должно быть позже начала в тот же день');
    }
    const assignment = await tx.groupTrainer.findUnique({
      where: { groupId_trainerId: { groupId, trainerId } },
    });
    if (!assignment) {
      if (!await tx.group.findUnique({ where: { id: groupId }, select: { id: true } })) {
        throw new NotFoundException('Группа не найдена');
      }
      if (!await tx.trainer.findUnique({ where: { id: trainerId }, select: { id: true } })) {
        throw new NotFoundException('Преподаватель не найден');
      }
      throw new ConflictException('Преподаватель не назначен этой группе');
    }

    // Prisma represents PostgreSQL TIME as a Date; use UTC for a stable time of day.
    const startTime = new Date('1970-01-01T' + slot.startTime + ':00Z');
    const endTime = new Date('1970-01-01T' + slot.endTime + ':00Z');
    const conflict = await tx.schedule.findFirst({
      where: {
        weekday,
        id: id === undefined ? undefined : { not: id },
        OR: [{ groupId }, { trainerId }],
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
      select: { groupId: true },
    });
    if (conflict) {
      throw new ConflictException(conflict.groupId === groupId
        ? 'У группы уже есть занятие в это время'
        : 'Преподаватель ведёт другое занятие в это время');
    }
    return { groupId, trainerId, weekday, startTime, endTime };
  }

  // Checking availability and saving must be one operation, including concurrent requests.
  private async writeSchedule<T>(operation: (tx: Prisma.TransactionClient) => Promise<T>) {
    for (let attempt = 1; ; attempt++) {
      try {
        return await this.prisma.$transaction(operation, { isolationLevel: 'Serializable' });
      } catch (error) {
        if (!isWriteConflict(error)) {
          throw error;
        }
        if (attempt === 3) {
          throw new ConflictException('Расписание одновременно изменилось, повторите запрос');
        }
      }
    }
  }
}
