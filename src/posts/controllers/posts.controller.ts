import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards
} from "@nestjs/common";
import { JwtAuthenticationGuard } from "../../auth/guards/jwt-authentication.guard";
import { RequestWithUser } from "../../auth/models/requestWithUser.interface";
import { ExceptionsLoggerFilter } from "../../utils/exceptions-logger.filter";
import { FindOneParams } from "../../utils/findOne-param";
import { CreatePostDto } from "../dto/createPost.dto";
import { UpdatePostDto } from "../dto/updatePost.dto";
import PostsService from "../services/posts.service";

@Controller("posts")
export default class PostsController {
  constructor(private readonly postsService: PostsService) {
  }

  @Get()
  async getPosts(@Query("search") search: string) {
    if (search) {
      return this.postsService.searchForPosts(search);
    }
    return this.postsService.getAllPosts();
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
