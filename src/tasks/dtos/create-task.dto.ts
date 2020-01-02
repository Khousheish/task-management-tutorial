import { IsNotEmpty } from 'class-validator';

export class CreateTaskDtoSchema {
  @IsNotEmpty()
  public readonly title: string;

  @IsNotEmpty()
  public readonly description: string;
}
