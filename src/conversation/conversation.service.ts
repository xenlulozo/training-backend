import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Conversation } from './entities/conversation.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    private jwtService: JwtService
  ) { }


  async refreshTokenByOldToken(authHeader: string) {
    const decoded = this.jwtService.decode(authHeader);
    // console.log("token", decoded)
    // return decodedJwt.name
    return decoded
  }
  async createOne(createConversationDto: CreateConversationDto) {
    console.log(
      this.refreshTokenByOldToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5IiwibmFtZSI6ImFiYyIsImlhdCI6MTY5MDM4NTQ1NH0.RTuo1V2dhGW3lJEokhQ3u3usG98uiLt8Ij62bSxvPEo")
    )
    return "ac"
  }
  async create(createConversationDto: CreateConversationDto): Promise<User[] | string> {
    try {
      const conversation = new Conversation();
      if (!createConversationDto.member) {
        return `params invalid`
      }
      let type = 0;
      const userIds = JSON.parse(createConversationDto.member)

      const userList = await this.usersRepository
        .createQueryBuilder('user')
        .select(['user.name', 'user.user_id'])
        .where('user.user_id IN (:...userIds)', { userIds })
        .getMany();

      if (userIds.length !== userList.length) {
        return `user is not exist`
      }
      if (userList.length === 2) {
        type = 1;
      }
      else {
        type = 2;
      }
      let groupName = ""
      userList.map((item, index) => {
        groupName += item.name
        if (index < userList.length - 1)
          groupName += ", "
      })


      conversation.type = type;
      conversation.member = userIds;
      conversation.name = groupName

      await this.conversationRepository.save(conversation)

      return userList

    } catch (error) {
      return error
    }


  }

  //   async getNameUser(user_id: number): Promise < User[] | false > {
  //   const user = await this.usersRepository.findBy({ user_id })
  //     if(user) {
  //     return user
  //   }
  //     return false
  // }
  async findAll(): Promise<Conversation[] | null> {
    const data = await this.conversationRepository.find({ select: ["conversation_id", "name", "avatar", "type", "member", "background", "last_activity", "status"] })
    return data;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} conversation`;
  // }

  // update(id: number, updateConversationDto: UpdateConversationDto) {
  //   return `This action updates a #${id} conversation`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} conversation`;
  // }
}
