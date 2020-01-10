import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@Auth/auth.module';
import { typeormConfig } from '@Config/typeorm.config';
import { TasksModule } from '@Tasks/tasks.module';

import { AppController } from './app.controller';

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
