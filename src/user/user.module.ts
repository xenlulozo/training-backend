import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
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
  }), TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService]

})
export class UserModule { }
