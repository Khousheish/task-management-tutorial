import { InternalServerErrorException, Logger } from '@nestjs/common';
import { json } from 'express';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { User } from '@Auth/user.entity';

import { CreateTaskDtoSchema } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger: Logger = new Logger('TaskRepository');

  public async getTasks(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search }: GetTasksFilterDto = filterDto;
    const query: SelectQueryBuilder<Task> = this.createQueryBuilder('task');

    query.andWhere('task.userId = :userId', { userId: user.id});

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
    }

    try {
      const tasks: Task[] = await query.getMany();

      return tasks;
    } catch (error) {
      this.logger.error(`Failed to get tasks for user ${user.username}, Filter: ${JSON.stringify(filterDto)}`, error.stack);

      throw new InternalServerErrorException();
    }
  }

  public async createTask(
    createTaskDto: CreateTaskDtoSchema,
    user: User,
  ): Promise<Task> {
    const { title, description }: CreateTaskDtoSchema = createTaskDto;

    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    try {
      await task.save();
    } catch (error) {
      this.logger.error(`Failed to create task for user ${user.username}, Data: ${JSON.stringify(createTaskDto)}`, error.stack);

      throw new InternalServerErrorException();
    }

    delete task.user;

    return task;
  }
}
