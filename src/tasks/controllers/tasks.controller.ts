import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';

import { CreateTaskDtoSchema } from '../dtos/create-task.dto';
import { GetTasksFilterDto } from '../dtos/get-tasks-filter.dto';
import { PatchTaskStatusDto } from '../dtos/patch-task-status.dto';
import { TaskStatusValidationPipe } from '../pipes/task-status-validation.pipe';
import { TasksService } from '../services/tasks.service';
import { Task } from '../task.entity';

@Controller('tasks')
export class TasksController {

  public constructor(
    private readonly tasksService: TasksService,
  ) {
  }

  @Get()
  public async getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto);
  }

  @Get(':id')
  public async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  public async createTask(@Body() createTaskDto: CreateTaskDtoSchema): Promise<Task> {
    return TasksService.createTask(createTaskDto);
  }

  @Patch(':id/status')
  public async patchTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(TaskStatusValidationPipe) patchTaskStatus: PatchTaskStatusDto,
  ): Promise<Task> {
    return this.tasksService.patchTaskStatus(id, patchTaskStatus.status);
  }

  @Delete(':id')
  public async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
