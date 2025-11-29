import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { IUser } from 'src/common';
import { UserRepository } from 'src/DB';
import { SignupBodyDTO } from './dto/signup.dto';

@Injectable()
export class AuthenticationService {
  private users: IUser[] = [];
  constructor(private readonly userRepository: UserRepository) {}

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
    return 'Done';
  }
}
