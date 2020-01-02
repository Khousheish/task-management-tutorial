import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { CreateTaskDtoSchema } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  public async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search }: GetTasksFilterDto = filterDto;
    const query: SelectQueryBuilder<Task> = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
    }

    const tasks: Task[] = await query.getMany();

    return tasks;
  }

  public static async createTask(createTaskDto: CreateTaskDtoSchema): Promise<Task> {
    const { title, description }: CreateTaskDtoSchema = createTaskDto;

    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;
  }
}
