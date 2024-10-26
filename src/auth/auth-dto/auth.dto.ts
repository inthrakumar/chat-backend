import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
  MaxLength,
} from 'class-validator';

export class AuthDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(10, {
    message:
      'Username must be at least 10 characters long and contain only alphanumeric characters.',
  })
  @MaxLength(20, {
    message: 'Username must not exceed 20 characters.',
  })
  username: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
