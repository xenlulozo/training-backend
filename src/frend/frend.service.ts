import { Injectable } from '@nestjs/common';
import { CreateFrendDto } from './dto/create-frend.dto';
import { UpdateFrendDto } from './dto/update-frend.dto';
import { Friend } from './entities/frend.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { log } from 'console';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class FrendService {
  constructor(
    private readonly elSearchService: ElasticsearchService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
  ) { }

  async create(createFrendDto: CreateFrendDto) {

    if (!createFrendDto.user_1 || !createFrendDto.user_2)
      return `params invalid`


    const userIds = [createFrendDto.user_1, createFrendDto.user_2]

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.user_id'])
      .where('user.user_id IN (:...userIds)', { userIds })
      .getMany();

    // log(user)

    if (userIds.length !== user.length)
      return `user does not exist`

    const friend = await this.friendRepository.findOne({ where: { user_1: createFrendDto.user_1, user_2: createFrendDto.user_2 } })
    // log(friend)

    // if (!friend) {
    //   return `friend already`
    // }

    if (friend?.type === 1) {
      return `friend already`
    }

    const newFriend = new Friend()
    newFriend.user_1 = createFrendDto.user_1;
    newFriend.user_2 = createFrendDto.user_2;
    newFriend.type = 1

    await this.friendRepository.save(newFriend)
    await this.elSearchService.index({
      index: 'friend',
      document: { ...newFriend },
    });
    return 'Add friend successfully';
  }

  async findAll() {
    return await this.friendRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} frend`;
  }

  update(id: number, updateFrendDto: UpdateFrendDto) {
    return `This action updates a #${id} frend`;
  }

  remove(id: number) {
    return `This action removes a #${id} frend`;
  }
}
