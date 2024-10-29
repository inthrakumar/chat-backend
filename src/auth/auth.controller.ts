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
import { CurrentUser } from '../utilities/decorators/currentuser.decorator';
import { JwtRTPayload, LoginPayload } from 'src/utilities/types/auth.types';
import { LocalGuard } from '../utilities/guards/local.guard';
import { Public } from '../utilities/decorators/public.decorator';
import { RtGuard } from 'src/utilities/guards/rt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('/local/signup')
  async signUp(
    @Body(ValidationPipe) userDetails: AuthDTO,
    @Res() res: Response,
  ) {
    try {
      const userDetail = await this.authService.signUp(userDetails);
      res.cookie('jwt', userDetail.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      return res.status(HttpStatus.CREATED).json({
        accessToken: userDetail.accessToken,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({ message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
  }
  @Public()
  @Post('/local/login')
  @UseGuards(LocalGuard)
  async login(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: LoginPayload,
  ) {
    const { accessToken, refreshToken } = user;
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return res.status(HttpStatus.OK).json({
      message: 'Login successful',
      accessToken: accessToken,
    });
  }

  @Public()
  @Post('/refresh')
  @UseGuards(RtGuard)
  async refreshTokens(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: JwtRTPayload,
  ) {
    const refreshpayload = await this.authService.refresh(
      user.id,
      user.email,
      user.refreshToken,
    );
    res.cookie('jwt', refreshpayload.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return res.status(HttpStatus.OK).json({
      accessToken: refreshpayload.accessToken,
    });
  }

  @Public()
  @Post('/logout')
  @UseGuards(RtGuard)
  async logout(
    @CurrentUser() user: JwtRTPayload,
    @Res() res: Response,
  ): Promise<any> {
    try {
      await this.authService.logout(user.id, user.email);
      res.clearCookie('jwt');
      return res.status(HttpStatus.OK).json({
        message: 'Logged out successfully',
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Failed to logout' + error.message,
      });
    }
  }
}
