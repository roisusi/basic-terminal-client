import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CliGateway } from './cli.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CliGateway],
})
export class AppModule {}
