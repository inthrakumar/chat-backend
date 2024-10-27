import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, mapping, auth } from 'cassandra-driver';
import { CassaandraConnectionData } from 'src/utilities/types/auth.types';

@Injectable()
export class CassandraService {
  constructor(private readonly configService: ConfigService) {}
  client: Client;
  mapper: mapping.Mapper;
  private createClient(connectionData: CassaandraConnectionData) {
    this.client = new Client({
      contactPoints: [connectionData.contactPoints],
      keyspace: connectionData.keyspace,
      localDataCenter: connectionData.localDataCenter,
      authProvider: new auth.PlainTextAuthProvider('cassandra', 'cassandra'),
    });
  }

  createMapper(mappingOptions: mapping.MappingOptions) {
    const connectionData: CassaandraConnectionData = {
      contactPoints: this.configService.get<string>('CASSANDRA_CONTACT_POINTS'),
      keyspace: this.configService.get<string>('CASSANDRA_KEYSPACE'),
      localDataCenter: this.configService.get<string>(
        'CASSANDRA_LOCAL_DATACENTER',
      ),
    };
    if (this.client == undefined) {
      this.createClient(connectionData);
    }
    return new mapping.Mapper(this.client, mappingOptions);
  }
}
