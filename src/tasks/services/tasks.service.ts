import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';

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

  public async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  public async getTaskById(id: number): Promise<Task> {
    const found: Task = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task With ID: ${id} Not Found`);
    }

    return found;
  }

  public async deleteTask(id: number): Promise<void> {
    const result: DeleteResult = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task With ID: ${id} Not Found`);
    }
  }

  public async patchTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task: Task = await this.getTaskById(id);

    task.status = status;
    await task.save();

    return task;
  }

  public static async createTask(createTaskDto: CreateTaskDtoSchema): Promise<Task> {
    return TaskRepository.createTask(createTaskDto);
  }
}
