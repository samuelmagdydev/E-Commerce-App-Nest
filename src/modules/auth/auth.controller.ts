import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { ConfirmEmailDTO, ResendConfirmEmailDTO, SignupBodyDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/signup')
  async signUp(@Body() body: SignupBodyDTO): Promise<{ message: string }> {
    await this.authenticationService.signup(body);
    return { message: 'Done' };
  }

  @Patch('/confirm-email')
  async confirmEmail(
    @Body() body: ConfirmEmailDTO,
  ): Promise<{ message: string }> {
    await this.authenticationService.confirmEmail(body);
    return { message: 'Done' };
  }


   @Post('/resend-confirm-email')
  async resendConfirmEmail(
    @Body() body: ResendConfirmEmailDTO,
  ): Promise<{ message: string }> {
    await this.authenticationService.resendConfirmEmail(body);
    return { message: 'Done' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  logIn() {
    return 'Log In Page';
  }
}
