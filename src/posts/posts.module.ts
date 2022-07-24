import {
  CacheModule,
  Module
} from "@nestjs/common";
import {
  ConfigModule,
  ConfigService
} from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as redisStore from "cache-manager-redis-store";
import { SearchModule } from "../search/search.module";
import PostsController from "./controllers/posts.controller";
import PostEntity from "./entities/post.entity";
import { PostsSearchService } from "./services/posts-search.service";
import PostsService from "./services/posts.service";

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          store: redisStore,
          host: configService.get("REDIS_HOST"),
          port: configService.get("REDIS_PORT"),
          ttl: 120
        };
      }
    }),
    TypeOrmModule.forFeature([PostEntity]),
    SearchModule
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsSearchService
  ]
})
export class PostsModule {
}
