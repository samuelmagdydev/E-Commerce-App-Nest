import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  createNumericalOtp,
  emailEvent,
  IUser,
  OtpEnum,
  ProviderEnum,
  SecurityService,
} from 'src/common';
import { OtpRepository, UserRepository } from 'src/DB';
import {
  ConfirmEmailDTO,
  LoginBodyDTO,
  ResendConfirmEmailDTO,
  SignupBodyDTO,
} from './dto/auth.dto';
import { Types } from 'mongoose';
import { sign } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  private users: IUser[] = [];
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
    private readonly securityService: SecurityService,
    private readonly jwtService : JwtService
  ) {}

  private async createConfirmEmailOtp(userId: Types.ObjectId) {
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

  async resendConfirmEmail(data: ResendConfirmEmailDTO): Promise<string> {
    const { email } = data;
    const user = await this.userRepository.findOne({
      filter: { email, confirmedAt: { $exists: false } },
      options: {
        populate: [{ path: 'otp', match: { type: OtpEnum.CONFIRM_EMAIL } }],
      },
    });
    if (!user) {
      throw new NotFoundException('Fail To Find Matched Account');
    }

    if (user.otp?.length) {
      throw new ConflictException(
        `Sorry We Can Not Grant You A New OTP Until The Existing One Become Expired Please Try Again After : ${user.otp[0].expiredAt}`,
      );
    }

    await this.createConfirmEmailOtp(user._id);

    return 'Done';
  }

  async confirmEmail(data: ConfirmEmailDTO): Promise<string> {
    const { email, code } = data;
    const user = await this.userRepository.findOne({
      filter: { email, confirmedAt: { $exists: false } },
      options: {
        populate: [{ path: 'otp', match: { type: OtpEnum.CONFIRM_EMAIL } }],
      },
    });
    if (!user) {
      throw new NotFoundException('Fail To Find Matched Account');
    }

    if (
      !(
        user.otp?.length &&
        (await this.securityService.compareHassh(code, user.otp[0].code))
      )
    ) {
      throw new BadRequestException('Invalid Or Expired OTP Code');
    }

    user.confirmedAt = new Date();
    await user.save();
    await this.otpRepository.deleteOne({
      filter: { _id: user.otp[0]._id },
    });

    return 'Done';
  }

  async login(data: LoginBodyDTO): Promise<{access_token:string ; refresh_token:string}> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({
      filter: {
        email,
        confirmedAt: { $exists: true },
        provider: ProviderEnum.SYSTEM,
      },
    });
    if (!user) {
      throw new NotFoundException('Incorrect Email Or Password');
    }

    if (!(await this.securityService.compareHassh(password, user.password))) {
      throw new NotFoundException('Incorrect Email Or Password');
    }

    const credentials = {
      access_token : await this.jwtService.signAsync({sub : user._id} ,{secret:"afjalfija" , expiresIn :60}),
      refresh_token : await this.jwtService.signAsync({sub : user._id} ,{secret:"afjalfija" , expiresIn : "1y"}),
    }
    return credentials;
  }
}
