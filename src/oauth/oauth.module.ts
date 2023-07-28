import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth } from './entities/oauth.entity';
import { User } from '../user/entities/user.entity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ElasticsearchModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      cloud: {
        id: "4ea1570f45434941bce9b719f7f7a9a9:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGVmYmJhNWQ4MDBmZDQxZGVhMDRjMTNmOTgwYjUzYzJkJDI4NmIzYzg5N2U0MDRkMTY5ZjI0OGIwMmMwYzRmODAy",
      },
      auth: {
        username: 'elastic',
        password: 'MJQRd33BBH6ZG9YZeVcJXOtr',
      },
    }),
    inject: [ConfigService],
  }), TypeOrmModule.forFeature([Oauth, User])],

  controllers: [OauthController],
  providers: [OauthService]
})
export class OauthModule { }
