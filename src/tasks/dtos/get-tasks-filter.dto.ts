import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { ArrayUtils } from 'src/utils/array.utils';

import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn(ArrayUtils.enumToArray(TaskStatus))
  public status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  public search: string;
}
