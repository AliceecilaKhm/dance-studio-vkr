import { Module } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { TrainersController } from './trainers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [TrainersController],
  providers: [TrainersService],
  imports: [PrismaModule],
})
export class TrainersModule {}
