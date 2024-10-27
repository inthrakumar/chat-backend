import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { AuthDTO, LoginDTO } from './auth-dto/auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Session } from 'neo4j-driver';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload, Tokens } from 'src/utilities/types/auth.types';
@Injectable()
export class AuthService {
  private readonly readSession: Session;
  private readonly writeSession: Session;

  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.readSession = this.neo4jService.getReadSession();
    this.writeSession = this.neo4jService.getWriteSession();
  }

  async signUp(userDetails: AuthDTO): Promise<Tokens> {
    const uniqueId = uuidv4();
    const { username, password, email } = userDetails;

    const userExistsQuery = `
      MATCH (u:User)
      WHERE u.username = $username OR u.email = $email
      RETURN u
    `;

    const existingUser = await this.readSession.run(userExistsQuery, {
      username,
      email,
    });

    if (existingUser.records.length > 0) {
      throw new ConflictException('Username or email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const tokens = await this.signTokens(uniqueId, email);
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, salt);
    const cypherQuery = `
      CREATE (u:User {id: $id, username: $username, email: $email, password: $password, rtHash: $rtHash})
      RETURN u
    `;

    await this.writeSession.run(cypherQuery, {
      id: uniqueId,
      username,
      email,
      password: encryptedPassword,
      rtHash: refreshTokenHash,
    });

    return tokens;
  }

  async userValidate(loginData: LoginDTO): Promise<LoginPayload> {
    const { identifier, password } = loginData;
    const userExistsQuery = `
      MATCH (u:User)
      WHERE u.username = $identifier OR u.email = $identifier
      RETURN DISTINCT u
      LIMIT 1
    `;

    const result = await this.readSession.run(userExistsQuery, {
      identifier,
    });

    const user =
      result.records.length > 0 ? result.records[0].get('u').properties : null;
    if (!user) {
      throw new UnauthorizedException('User Not Found.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const tokens = await this.signTokens(user.email, user.id);
    const cypherQuery = `
  MATCH (u:User {id: $id})
  SET u.rtHash = $rtHash
  RETURN u
`;
    await this.writeSession.run(cypherQuery, {
      id: user.id,
      rtHash: await bcrypt.hash(tokens.refreshToken, 10),
    });

    return {
      id: user.id,
      email: user.email,
      ...tokens,
    };
  }

  async logout() {}

  async forgotPassword() {}

  async resetPassword() {}

  async refresh(
    id: string,
    email: string,
    refreshToken: string,
  ): Promise<Tokens> {
    const cypherQuery = `
      MATCH (u:User {id: $id}) RETURN u
    `;
    const result = await this.readSession.run(cypherQuery, { id });

    if (!(result.records.length > 0)) {
      throw new UnauthorizedException('User Not Found.');
    }

    const user = result.records[0].get('u').properties;
    if (!user || !user.rtHash) {
      throw new UnauthorizedException('Invalid user');
    }

    const rtMatches = await bcrypt.compare(refreshToken, user.rtHash);

    if (!rtMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.signTokens(id, email);

    const cypherRtQuery = `
      MATCH (u:User {email: $email})
      SET u.rtHash = $rtHash
      RETURN u
    `;
    const rtHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.writeSession.run(cypherRtQuery, {
      email: user.email,
      rtHash,
    });

    return tokens;
  }

  async signTokens(id: string, email: string): Promise<Tokens> {
    const accessKey = this.configService.get<string>('JWT_SECRET');
    const refreshKey = this.configService.get<string>('REFRESH_JWT_SECRET');
    const accessTokenFn = this.jwtService.signAsync(
      { id, email },
      {
        secret: accessKey,
        expiresIn: '15m',
      },
    );
    const refreshTokenFn = this.jwtService.signAsync(
      { id, email },
      {
        secret: refreshKey,
        expiresIn: '7d',
      },
    );
    const [accessToken, refreshToken] = await Promise.all([
      accessTokenFn,
      refreshTokenFn,
    ]);
    return { accessToken, refreshToken };
  }
}
