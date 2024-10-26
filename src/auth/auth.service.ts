import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { AuthDTO } from './auth-dto/auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import { Session } from 'neo4j-driver';

@Injectable()
export class AuthService {
  private readSession: Session;
  private writeSession: Session;

  constructor(
    private readonly usersService: UsersService,
    private readonly neo4jService: Neo4jService,
    private readonly configService: ConfigService,
  ) {
    this.readSession = this.neo4jService.getReadSession();
    this.writeSession = this.neo4jService.getWriteSession();
  }

  async signUp(
    userDetails: AuthDTO,
  ): Promise<{ message: string; user: { username: string; email: string } }> {
    const uniqueId = uuidv4();
    const { username, password, email } = userDetails;

    const encryptionKey = this.configService.get<string>('AES_ENCRYPTION_KEY');
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      encryptionKey,
    ).toString();

    const userExistsQuery = `
  MATCH (u:user)
  WHERE u.username = $username OR u.email = $email
  RETURN u
`;

    const existingUser = await this.readSession.run(userExistsQuery, {
      username,
      email,
    });

    if (existingUser.records.length > 0) {
      throw new ConflictException('Username already exists.');
    }

    const cypher = `
      CREATE (u:user {id: $id, username: $username, email: $email, password: $password})
      RETURN u
    `;

    await this.writeSession.run(cypher, {
      id: uniqueId,
      username,
      email,
      password: encryptedPassword,
    });

    return {
      message: 'User created successfully.',
      user: {
        username,
        email,
      },
    };
  }
}
