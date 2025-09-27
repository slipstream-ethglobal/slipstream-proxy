import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChainModule } from './chain/chain.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    HealthModule,
    ChainModule,
    CommonModule,
    TransfersModule,
  ],
})
export class AppModule {}
