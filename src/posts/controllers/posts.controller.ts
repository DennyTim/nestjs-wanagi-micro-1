import {
  Body,
  CacheKey,
  CacheTTL,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { JwtAuthenticationGuard } from "../../auth/guards/jwt-authentication.guard";
import { RequestWithUser } from "../../auth/models/requestWithUser.interface";
import { ExceptionsLoggerFilter } from "../../utils/exceptions-logger.filter";
import { FindOneParams } from "../../utils/findOne-param";
import { PaginationParams } from "../../utils/types/pagination-params.dto";
import { GET_POSTS_CACHE_KEY } from "../constants/posts-cache-key.constant";
import { CreatePostDto } from "../dto/createPost.dto";
import { UpdatePostDto } from "../dto/updatePost.dto";
import { HttpCacheInterceptor } from "../interceptors/http-cache.interceptor";
import PostsService from "../services/posts.service";

@Controller("posts")
@UseInterceptors(ClassSerializerInterceptor)
export default class PostsController {
  constructor(private readonly postsService: PostsService) {
  }

  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_POSTS_CACHE_KEY)
  @CacheTTL(120)
  @Get()
  async getPosts(
    @Query("search") search: string,
    @Query() { offset, limit, startId }: PaginationParams
  ) {
    if (search) {
      return this.postsService.searchForPosts(search, offset, limit, startId);
    }
    return this.postsService.getAllPosts(offset, limit, startId);
  }

  @Get(":id")
  @UseFilters(ExceptionsLoggerFilter)
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(post, req.user);
  }

  @Patch(":id")
  async updatePost(
    @Param() { id }: FindOneParams,
    @Body() post: UpdatePostDto
  ) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(":id")
  async deletePost(@Param("id") id: string) {
    await this.postsService.deletePost(Number(id));
  }
}
