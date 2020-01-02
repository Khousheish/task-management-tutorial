import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';

import { AppController } from './app.controller';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    TasksModule,
    AuthModule,
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule {
}
