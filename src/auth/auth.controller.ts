import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  HttpStatus,
  Res,
  ConflictException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './auth-dto/auth.dto';
import { Response } from 'express';
import { CurrentUser } from './decorators/currentuser.decorator';
import { Tokens } from 'src/types/auth.types';
import { LocalGuard } from './guards/local.guard';

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
  @Post('/local/login')
  @UseGuards(LocalGuard)
  async login(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: Tokens,
  ) {
    return res.status(HttpStatus.OK).json({
      message: 'Login successful',
      user: user,
    });
  }
}
