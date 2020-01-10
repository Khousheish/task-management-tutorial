import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetUser } from '@Auth/get-user.decorator';
import { User } from '@Auth/user.entity';

import { CreateTaskDtoSchema } from '../dtos/create-task.dto';
import { GetTasksFilterDto } from '../dtos/get-tasks-filter.dto';
import { PatchTaskStatusDto } from '../dtos/patch-task-status.dto';
import { TaskStatusValidationPipe } from '../pipes/task-status-validation.pipe';
import { TasksService } from '../services/tasks.service';
import { Task } from '../task.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger: Logger = new Logger('TasksController');

  public constructor(
    private readonly tasksService: TasksService,
  ) {
  }

  @Get()
  public async getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`User ${user.username} retrieving all tasks. Filters ${JSON.stringify(filterDto)}`);

    return this.tasksService.getTasks(filterDto, user);
  }

  @Get(':id')
  public async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  public async createTask(
    @Body() createTaskDto: CreateTaskDtoSchema,
    @GetUser() user: User,
    ): Promise<Task> {
    this.logger.verbose(`User ${user.username} creating a new task. Data ${JSON.stringify(createTaskDto)}`);

    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch(':id/status')
  public async patchTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(TaskStatusValidationPipe) patchTaskStatus: PatchTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.patchTaskStatus(id, patchTaskStatus.status, user);
  }

  @Delete(':id')
  public async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }
}
