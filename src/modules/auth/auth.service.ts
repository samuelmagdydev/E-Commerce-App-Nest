import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { createNumericalOtp, emailEvent, IUser, OtpEnum } from 'src/common';
import { OtpRepository, UserRepository } from 'src/DB';
import { SignupBodyDTO } from './dto/auth.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthenticationService {
  private users: IUser[] = [];
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
  ) {}


  private async createConfirmEmailOtp (userId:Types.ObjectId){
      await this.otpRepository.create({
      data: [
        {
          code: createNumericalOtp(),
          expiredAt: new Date(Date.now() + 2 * 60 * 1000),
          createdBy: userId,
          type: OtpEnum.CONFIRM_EMAIL,
        },
      ],
    });
  }

  async signup(data: SignupBodyDTO): Promise<string> {
    const { email, password, username } = data;
    const checkUserExit = await this.userRepository.findOne({
      filter: { email },
    });
    if (checkUserExit) {
      throw new ConflictException('Email already exists');
    }

    const [user] = await this.userRepository.create({
      data: [{ username, email, password }],
    });

    if (!user) {
      throw new BadRequestException(
        'There was an error creating the user. Please try again.',
      );
    }

   await this.createConfirmEmailOtp(user._id);  
    return 'Done';
  }
}
