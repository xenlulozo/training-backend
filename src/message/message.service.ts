import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Conversation } from '../conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>
    ,
    @InjectRepository(User)
    private userRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
  ) { }
  async create(createMessageDto: CreateMessageDto): Promise<string> {
    const conversation_id = createMessageDto.conversation_id
    const user_id = createMessageDto.user_id;
    const message = new Message()
    message.user_id = user_id
    message.message = createMessageDto.message;
    message.conversation_id = conversation_id

    if (!await this.messageRepository.findOneBy({ conversation_id }))
      return `conversation isnt exist`

    if (!await this.userRepository.findOneBy({ user_id }))
      return `user isnt exist`


    try {
      await this.messageRepository.save(message)
      const conver = await this.conversationRepository.findOneBy({ conversation_id })
      const last_id = await this.messageRepository.findOne({
        where: [{ conversation_id }],
        order: { message_id: 'DESC' }
      })

      conver.last_message_id = last_id.message_id
      await this.conversationRepository.save(conver)
      // return last_id.message_id
      return `create group chat success`
    } catch (error) {
      return error
    }
  }

  findAll() {
    return `This action returns all message`;
  }

  async findOne(conversation_id: number): Promise<Message[] | string> {


    const conversation = await this.messageRepository
      .createQueryBuilder('message')
      .select(['message.message_id', 'message.conversation_id', 'message.user_id', 'message.timestamp', 'message.message'])
      .orderBy('timestamp')
      .where('message.conversation_id = :conversationId', { conversationId: conversation_id })
      .getMany();

    if (!conversation || conversation.length === 0) {
      return 'Conversation not found or empty';
    }

    return conversation

  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
