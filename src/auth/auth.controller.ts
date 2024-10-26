import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  HttpStatus,
  Res,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './auth-dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/signup')
  async signUp(
    @Body(ValidationPipe) userDetails: AuthDTO,
    @Res() res: Response,
  ) {
    try {
      const userDetail = await this.authService.signUp(userDetails);
      return res.status(HttpStatus.CREATED).json(userDetail);
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({ message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
  }
}
