import { Module } from '@nestjs/common';
import { ChatWebSocketGateway } from './gateway';
@Module({
  providers: [ChatWebSocketGateway],
})
export class ChatGatewayModule {}
