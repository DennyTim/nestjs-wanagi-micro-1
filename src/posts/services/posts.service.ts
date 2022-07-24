import {
  CACHE_MANAGER,
  Inject,
  Injectable
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import PostEntity from "src/posts/entities/post.entity";
import {
  FindManyOptions,
  In,
  MoreThan,
  Repository
} from "typeorm";
import { UserEntity } from "../../users/user.entity";
import { GET_POSTS_CACHE_KEY } from "../constants/posts-cache-key.constant";
import { CreatePostDto } from "../dto/createPost.dto";
import { UpdatePostDto } from "../dto/updatePost.dto";
import { PostNotFoundException } from "../exceptions/post-not-found.exception";
import { Post } from "../models/post.interface";
import { PostsSearchService } from "./posts-search.service";

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
    private postsSearchService: PostsSearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
  }

  async clearCache(): Promise<boolean> {
    if (!this.cacheManager.store.keys) {
      return false;
    }

    for (const key of await this.cacheManager.store.keys()) {
      if (key.startsWith(GET_POSTS_CACHE_KEY)) {
        await this.cacheManager.del(key);
      }
    }

    return true;
  }

  async getAllPosts(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<Post>["where"] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postsRepository.count();
    }
    const [items, count] = await this.postsRepository.findAndCount({
      where,
      relations: ["author"],
      order: {
        id: "ASC"
      },
      skip: offset,
      take: limit
    });

    return {
      items,
      count: startId ? separateCount : count
    };
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
      await this.clearCache();
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
    await this.clearCache();
    return savedPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
    await this.postsSearchService.remove(id);
    await this.clearCache();
  }

  async searchForPosts(
    text: string,
    offset?: number,
    limit?: number,
    startId?: number
  ) {
    const { results, count } = await this.postsSearchService.search(text, offset, limit, startId);
    const ids = results.map(result => result.id);

    if (!ids.length) {
      return {
        items: [],
        count
      };
    }

    const items = await this.postsRepository.find({
      where: { id: In(ids) }
    });

    return {
      items,
      count
    };
  }
}
