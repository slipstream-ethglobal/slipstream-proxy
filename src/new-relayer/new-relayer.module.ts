import { Module } from '@nestjs/common';
import { NewRelayerService } from './new-relayer.service';
import { NewRelayerController } from './new-relayer.controller';

@Module({
  controllers: [NewRelayerController],
  providers: [NewRelayerService],
})
export class NewRelayerModule {}
