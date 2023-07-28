import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // ConfigModule,
    ElasticsearchModule.registerAsync({
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
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule { }
