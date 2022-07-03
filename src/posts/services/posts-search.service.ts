import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import PostEntity from "../entities/post.entity";
import { PostSearchBody } from "../types/post-search-body.model";
import { PostSearchResult } from "../types/post-search-result.model";

@Injectable()
export class PostsSearchService {
  public index = "posts";

  constructor(private readonly elasticSearchService: ElasticsearchService) {
  }

  async indexPost(post: PostEntity) {
    return this.elasticSearchService.index<PostSearchResult, PostSearchBody>({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.author.id
      }
    });
  }

  async search(text: string) {
    const { body } = await this.elasticSearchService.search<PostSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ["title", "content"]
          }
        }
      }
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async remove(postId: number) {
    await this.elasticSearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId
          }
        }
      }
    });
  }

  async update(post: PostEntity) {
    const newBody: PostSearchBody = {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.author.id
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) =>
        `${result} ctx._source.${key}='${value}';`
      , "");

    return this.elasticSearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: { id: post.id }
        },
        script: script
      }
    });
  }
}
