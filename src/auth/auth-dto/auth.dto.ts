import {
  IsString,
  IsEmail,
  IsAlphanumeric,
  MinLength,
  MaxLength,
  IsNotEmpty,
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
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message:
      'Username must be at least 10 characters long and contain only alphanumeric characters.',
  })
  @MaxLength(20, {
    message: 'Username must not exceed 20 characters.',
  })
  password: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
