import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { NewRelayerModule } from './new-relayer/new-relayer.module';

// import { ChainModule } from './chain/chain.module';
// import { HealthModule } from './health/health.module';
// import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // HealthModule,
    // ChainModule,
    // TransfersModule,
    CommonModule,
    NewRelayerModule,
  ],
})
export class AppModule {}
