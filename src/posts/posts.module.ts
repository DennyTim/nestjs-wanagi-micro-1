import {
  CacheModule,
  Module
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SearchModule } from "../search/search.module";
import PostsController from "./controllers/posts.controller";
import PostEntity from "./entities/post.entity";
import { PostsSearchService } from "./services/posts-search.service";
import PostsService from "./services/posts.service";

@Module({
  imports: [
    CacheModule.register({
      ttl: 5,
      max: 100
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
