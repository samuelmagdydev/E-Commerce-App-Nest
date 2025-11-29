import { Module } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModel, UserRepository } from 'src/DB';

@Module({
  imports: [UserModel],
  controllers: [AuthController ],
  providers: [AuthenticationService , UserRepository],
  exports: [],
})
export class AuthenticationModule {}


