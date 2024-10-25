import { Inject, Injectable } from '@nestjs/common';
import { Driver } from 'neo4j-driver';
import neo4j from 'neo4j-driver';
import { Neo4jConfig } from 'src/neo4j-config/neo4j-config.interface';
import { Neo4J_CONFIG, Neo4J_DRIVER } from './neo4j.data';

@Injectable()
export class Neo4jService {
  constructor(
    @Inject(Neo4J_CONFIG) private readonly config: Neo4jConfig,
    @Inject(Neo4J_DRIVER) private readonly driver: Driver,
  ) {}

  getDriver(): Driver {
    return this.driver;
  }

  getConfig(): Neo4jConfig {
    return this.config;
  }

  getReadSession(database?: string) {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: neo4j.session.READ,
    });
  }

  getWriteSession(database?: string) {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: neo4j.session.WRITE,
    });
  }

  OnAPpClose() {
    this.driver.close();
  }
}
