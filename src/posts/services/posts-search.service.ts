import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import PostEntity from "../entities/post.entity";
import { PostCountResult } from "../types/post-count-result.model";
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
        paragraphs: post.paragraphs,
        authorId: post.author.id
      }
    });
  }

  async search(
    text: string,
    offset?: number,
    limit?: number,
    startId = 0
  ) {
    let separateCount = 0;
    if (startId) {
      separateCount = await this.count(text, ['title', 'paragraphs']);
    }
    const { body } = await this.elasticSearchService.search<PostSearchResult>({
      index: this.index,
      from: offset,
      size: limit,
      body: {
        query: {
          bool: {
            should: {
              multi_match: {
                query: text,
                fields: ["title", "paragraphs"]
              }
            },
            filter: {
              range: {
                id: {
                  gt: startId
                }
              }
            }
          }
        },
        sort: {
          id: {
            order: "asc"
          }
        }
      }
    });
    const count = body.hits.total["value"];
    const hits = body.hits.hits;
    const results = hits.map((item) => item._source);
    return {
      count: startId ? separateCount : count,
      results
    };
  }

  async count(query: string, fields: string[]) {
    const { body } = await this.elasticSearchService.count<PostCountResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query,
            fields
          }
        }
      }
    });
    return body.count;
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
      paragraphs: post.paragraphs,
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
