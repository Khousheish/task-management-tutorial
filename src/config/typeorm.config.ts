import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { User } from '@Auth/user.entity';
import { Task } from '@Tasks/task.entity';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'khoush@13',
  database: 'taskmanagement',
  entities: [Task, User],
  synchronize: true,
};
