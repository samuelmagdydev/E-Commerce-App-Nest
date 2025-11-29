import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  ValidateIf,
} from 'class-validator';
import { IsMatch } from 'src/common';

export class SignupBodyDTO {
  @Length(4, 20, {
    message: 'Username must be between 4 and 20 characters long',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters',
    },
  )
  @IsNotEmpty()
  password: string;

  @ValidateIf((data: SignupBodyDTO) => {
    return Boolean(data.password);
  })
  @IsMatch<string>(['password'])
  confirmPassword: string;
}
