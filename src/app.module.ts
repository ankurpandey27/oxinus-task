import {
  BadRequestException,
  Module,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from './app/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import * as ormconfig from './core/config/typeorm';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CustomExceptionsFilter } from './core/utility/filter';
import { AccountModule } from './app/account/account.module';
@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: ormconfig.TypeOrmService,
    }),
    TerminusModule,
    AuthModule,
    AccountModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        exceptionFactory: (error: ValidationError[]) =>
          new BadRequestException(error),
      }),
    },
  ],
})
export class AppModule {}
