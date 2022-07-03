import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import PostEntity from "src/posts/entities/post.entity";
import {
  In,
  Repository
} from "typeorm";
import { UserEntity } from "../../users/user.entity";
import { CreatePostDto } from "../dto/createPost.dto";
import { UpdatePostDto } from "../dto/updatePost.dto";
import { PostNotFoundException } from "../exceptions/post-not-found.exception";
import { PostsSearchService } from "./posts-search.service";

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
    private postsSearchService: PostsSearchService
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

  async getPostsWithParagraph(paragraph: string) {
    return this.postsRepository
      .query(`SELECT *
              from post
              WHERE $1 = ANY (paragraphs)`, [paragraph]);
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne({ where: { id }, relations: ["author"] });
    if (updatedPost) {
      await this.postsSearchService.update(updatedPost);
      return updatedPost;
    }
    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto, user: UserEntity) {
    const newPost = await this.postsRepository.create({
      ...post,
      author: {
        ...user,
        password: undefined
      }
    });
    const savedPost = await this.postsRepository.save(newPost);
    this.postsSearchService.indexPost(savedPost);
    return savedPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
    await this.postsSearchService.remove(id);
  }

  async searchForPosts(text: string) {
    const results = await this.postsSearchService.search(text);
    const ids = results.map(result => result.id);

    if (!ids.length) {
      return [];
    }

    return this.postsRepository.find({ where: { id: In(ids) } });
  }
}
