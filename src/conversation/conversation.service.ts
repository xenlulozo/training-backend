import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Conversation } from './entities/conversation.entity';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { check } from 'prettier';

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
    // log("sh", JSON.parse(createConversationDto.member))

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

      const checkConver = await this.conversationRepository
        .createQueryBuilder('conversation')
        .select(['conversation.member'])
        .where('ARRAY[:...userIds]::int[] && conversation.member', { userIds })
        .getMany();


      // console.log("check", checkConver)
      checkConver && checkConver.map((item) => {
        // log(this.areArraysEqual(item.member, userIds))
        if (!this.areArraysEqual(item.member, userIds))
          type = -1
      })

      if (type === -1)
        return `conversation is exist`
      // if (checkConver.length === userIds)
      //   return `conversation is exist`

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

      // await this.conversationRepository.save(conversation)

      return `create conversation success`

    } catch (error) {
      return error
    }


  }
  areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
        return false;
      }
    }

    return true;
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
