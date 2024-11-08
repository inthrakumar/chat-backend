import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    maxAge: 600000,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
})
export class ChatWebSocketGateway {
  constructor() {}
}
