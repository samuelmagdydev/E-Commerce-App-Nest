import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { SignupBodyDTO } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/signup')
  async signUp(@Body() body: SignupBodyDTO): Promise<{ message: string }> {
    await this.authenticationService.signup(body);
    return { message: 'Done' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  logIn() {
    return 'Log In Page';
  }
}
