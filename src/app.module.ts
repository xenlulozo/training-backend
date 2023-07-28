import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ProductModule } from './modules/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation/entities/conversation.entity';
import { ConversationModule } from './conversation/conversation.module';
import { Message } from './message/entities/message.entity';
import { User } from './user/entities/user.entity';
import { Oauth } from './oauth/entities/oauth.entity';
import { MessageModule } from './message/message.module';
import { OauthModule } from './oauth/oauth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './user/const';
import { RedisModule } from '@nestjs-modules/ioredis';
import { GatewayModule } from './gateway/gateway.module';
import { SocketDb } from './gateway/socket.entity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchModule } from './search/search.module';
import { FrendModule } from './frend/frend.module';
import { Friend } from './frend/entities/frend.entity';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          url: 'redis://localhost:6379',
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: 'localhost',
      port: 5432,
      username: 'add',
      password: '123456',
      database: 'add',
      entities: [Conversation, Message, User, Oauth, SocketDb, Friend],
      // entities: [Test],
      synchronize: true,
      autoLoadEntities: true,
    }), GatewayModule, ConversationModule, MessageModule, OauthModule, UserModule, JwtModule.register({
      global: true,
      secret: jwtConstants.secret,

    }), SearchModule, FrendModule,


  ],
  // imports: [ConversationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
