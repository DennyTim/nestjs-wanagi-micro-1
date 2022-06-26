import {
  HttpException,
  HttpStatus,
  Injectable
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import PostEntity from "src/posts/entities/post.entity";
import { Repository } from "typeorm";
import { Category } from "../../categories/category.entity";
import { UpdateCategoryDto } from "../../categories/dto/update-category.dto";
import { User } from "../../users/user.entity";
import { CreatePostDto } from "../dto/createPost.dto";
import { UpdatePostDto } from "../dto/updatePost.dto";
import { CategoryNotFoundException } from "../exceptions/category-not-found.exception";
import { PostNotFoundException } from "../exceptions/post-not-found.exception";

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>
  ) {
  }

  getAllPosts() {
    return this.postsRepository.find({ relations: ["author"] });
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ["author"] });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne({ where: { id }, relations: ["author"] });
    if (updatedPost) {
      return updatedPost;
    }
    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.create({
      ...post,
      author: {
        ...user,
        password: undefined
      }
    });
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException("Post not found", HttpStatus.NOT_FOUND);
    }
  }
}
