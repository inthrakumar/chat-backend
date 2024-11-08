import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import { AtGuard } from './utilities/guards/at.guard';
import * as cookieParser from 'cookie-parser';
async function initServer() {
  const app = await NestFactory.create(AppModule);
  const reflector = new Reflector();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AtGuard(reflector));
  app.use(passport.initialize());
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['Authorization'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600000,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

initServer();
