import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Neo4jService } from './neo4j/neo4j.service';
import { UseGuards } from '@nestjs/common';
import { AtGuard } from './utilities/guards/at.guard';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly neo4jService: Neo4jService,
  ) {} // Added missing closing parenthesis and curly bracket
  @UseGuards(AtGuard)
  @Get()
  getHello(): string {
    return 'this is good connected to neo4j';
  }
}
