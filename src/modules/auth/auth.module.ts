import { Module } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { AuthController } from './auth.controller';
import { OtpModel, OtpRepository, UserModel, UserRepository } from 'src/DB';

@Module({
  imports: [UserModel, OtpModel],
  controllers: [AuthController],
  providers: [AuthenticationService, UserRepository, OtpRepository],
  exports: [],
})
export class AuthenticationModule {}
