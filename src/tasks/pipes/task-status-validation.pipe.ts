import { BadRequestException, PipeTransform } from '@nestjs/common';

import { PatchTaskStatusDto } from '../dtos/patch-task-status.dto';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  private readonly allowedStatuses: TaskStatus[] = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  public transform(value: PatchTaskStatusDto): PatchTaskStatusDto {
    if (!this.isStatusValid(value.status)) {
      throw new BadRequestException(`${value.status} is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: TaskStatus): boolean {
    const id: number = this.allowedStatuses.indexOf(status);

    return id !== -1;
  }
}
