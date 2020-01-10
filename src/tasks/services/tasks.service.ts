import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';

import { User } from '@Auth/user.entity';

import { CreateTaskDtoSchema } from '../dtos/create-task.dto';
import { GetTasksFilterDto } from '../dtos/get-tasks-filter.dto';
import { TaskStatus } from '../task-status.enum';
import { Task } from '../task.entity';
import { TaskRepository } from '../task.repository';

@Injectable()
export class TasksService {

  public constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {
  }

  public async getTasks(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  public async getTaskById(
    id: number,
    user: User,
  ): Promise<Task> {
    const found: Task = await this.taskRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!found) {
      throw new NotFoundException(`Task With ID: ${id} Not Found`);
    }

    return found;
  }

  public async deleteTask(
    id: number,
    user: User,
  ): Promise<void> {
    const result: DeleteResult = await this.taskRepository.delete({
      id,
      userId: user.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Task With ID: ${id} Not Found`);
    }
  }

  public async patchTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task: Task = await this.getTaskById(id, user);

    task.status = status;
    await task.save();

    return task;
  }

  public async createTask(createTaskDto: CreateTaskDtoSchema, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }
}
