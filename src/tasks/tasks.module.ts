import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@Auth/auth.module';

import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { TaskRepository } from './task.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([TaskRepository]),
  ],
  controllers: [
    TasksController,
  ],
  providers: [
    TasksService,
  ],
})
export class TasksModule {
}
