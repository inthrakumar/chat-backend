import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule } from './neo4j/neo4j.module';
import { CassandraModule } from './cassandra/cassandra.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { Neo4jScheme } from './neo4j-config/neo4j-config.interface';

import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        scheme: configService.get<string>('database.scheme') as Neo4jScheme,
        hostname: configService.get<string>('database.url'),
        port: configService.get<number>('database.port'),
        database: configService.get<string>('database.db'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
      }),
      inject: [ConfigService],
    }),
    CassandraModule,

    UsersModule,

    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
