import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { GameModule } from './modules/games/game.module';
import { RoundModule } from './modules/rounds/round.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://admin:admin@atlascluster.brfzfhn.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster/guess-number"),
    AuthModule,
    UserModule,
    GameModule,
    RoundModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
