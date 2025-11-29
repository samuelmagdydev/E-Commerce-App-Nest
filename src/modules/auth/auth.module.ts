import { Module } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModel } from 'src/DB';

@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [AuthenticationService],
  exports: [],
})
export class AuthenticationModule {}


