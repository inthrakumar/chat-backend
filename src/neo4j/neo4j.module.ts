// src/neo4j/neo4j.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import { Neo4jConfig } from 'src/neo4j-config/neo4j-config.interface';
import { Neo4J_CONFIG, Neo4J_DRIVER } from './neo4j.data';
import { createDriver } from './neo4j.utils';
import { ConfigService } from '@nestjs/config';

@Module({})
export class Neo4jModule {
  static forRootAsync(options: {
    imports: any[];
    useFactory: (configService: ConfigService) => Neo4jConfig;
    inject: any[];
  }): DynamicModule {
    return {
      module: Neo4jModule,
      imports: options.imports,
      providers: [
        {
          provide: Neo4J_CONFIG,
          inject: options.inject,
          useFactory: options.useFactory,
        },
        {
          provide: Neo4J_DRIVER,
          inject: [Neo4J_CONFIG],
          useFactory: async (config: Neo4jConfig) => createDriver(config),
        },
        Neo4jService,
      ],
      exports: [Neo4jService, Neo4J_DRIVER],
    };
  }
}
