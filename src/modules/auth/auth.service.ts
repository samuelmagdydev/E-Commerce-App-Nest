import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/common';
import { User, UserDocument } from 'src/DB';
import { SignupBodyDTO } from './dto/signup.dto';

@Injectable()
export class AuthenticationService {
  private users: IUser[] = [];
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async signup(data: SignupBodyDTO): Promise<string> {
    const { email, password, username } = data;
    const checkUserExit = await this.model.findOne({ email });
    if (checkUserExit) {
      throw new ConflictException('Email already exists');
    }

    const [user] = await this.model.create([{
      username,
      email,
      password,
    }])

    return 'Done';
  }
}
