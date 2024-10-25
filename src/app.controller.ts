import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Neo4jService } from './neo4j/neo4j.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly neo4jService: Neo4jService,
  ) {} // Added missing closing parenthesis and curly bracket

  @Get()
  getHello(): string {
    return 'this is good connected to neo4j';
  }
}
