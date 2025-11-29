import { Injectable } from '@nestjs/common';
import { IUser } from 'src/common';

@Injectable()
export class UserService {
  constructor() {}

  allUsers(): IUser[] {
    return [
      {
        id: 1,
        username: 'john_doe',
        email: 'asffa@gmail.com',
        password: 'hashed_password',
      },
    ];
  }
}
