import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { ChildrenModule } from './children/children.module';
import { TrainersModule } from './trainers/trainers.module';


@Module({
  imports: [PrismaModule, ConfigModule.forRoot({isGlobal: true}), UsersModule, AuthModule, GroupsModule, ChildrenModule, TrainersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
