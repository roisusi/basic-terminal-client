// src/cli.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { spawn } from 'child_process';

@WebSocketGateway({ cors: true }) // Enable CORS so that your React app can connect
export class CliGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('run-command')
  handleRunCommand(@MessageBody() command: string): void {
    console.log(`Received command: ${command}`);

    // Spawn the command using Node's child_process.spawn with shell enabled
    const child = spawn(command, { shell: true });

    child.stdout.on('data', (data) => {
      this.server.emit('command-output', data.toString());
    });

    child.stderr.on('data', (data) => {
      this.server.emit('command-output', data.toString());
    });

    child.on('close', (code) => {
      this.server.emit('command-finished', `Command exited with code ${code}`);
    });
  }
}
