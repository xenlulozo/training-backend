import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Client } from '@elastic/elasticsearch'
@Injectable()
export class SearchService {

  constructor(private readonly elSearchService: ElasticsearchService) { }

  async create(createSearchDto: CreateSearchDto) {

    // const putData = {

    //   message: "yes",
    //   user: "UserB",

    // };

    // try {
    //   const response = await this.elSearchService.index({
    //     index: 'message',
    //     document: { ...putData },
    //   });
    //   console.log('Document indexed successfully:', response);
    // } catch (error) {
    //   console.error('Error indexing document:', error);
    // }

    return await this.elSearchService.search({
      index: "message",
      'query': {
        "bool": {
          "must": {
            match: {
              "message": "yes"
            }
          }
        }
      }
    })
    // return 'This action adds a new search';
  }

  findAll() {
    return `This action returns all search`;
  }

  async getUser() {
    return await this.elSearchService.search({
      index: "user",
      'query': {
        "bool": {
          "must": {
            match_all: {}
          }
        }
      }
    })
  }
  async getConversatione() {
    return await this.elSearchService.search({
      index: "conversation",
      'query': {
        "bool": {
          "must": {
            match_all: {}
          }
        }
      }
    })
  }
  async getMessage() {
    return await this.elSearchService.search({
      index: "message",
      'query': {
        "bool": {
          "must": {
            match_all: {}
          }
        }
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} search`;
  }

  update(id: number, updateSearchDto: UpdateSearchDto) {
    return `This action updates a #${id} search`;
  }

  remove(id: number) {
    return `This action removes a #${id} search`;
  }
}
