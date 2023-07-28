import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { User } from 'src/user/entities/user.entity';
import { Conversation } from './entities/conversation.entity';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }

  @Post()
  async create(@Body() createConversationDto: CreateConversationDto): Promise<ResponseData<User[] | string>> {
    try {
      const abc = await this.conversationService.create(createConversationDto)
      return new ResponseData<User[] | string>(abc, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<User[] | string>(null, HttpStatus.ERROR, HttpMessage.ERROR);

    }
  }
  @Post("one")
  createOne(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.createOne(createConversationDto);
  }

  @Get()
  async findAll(): Promise<ResponseData<Conversation[] | null>> {
    try {
      const result = await this.conversationService.findAll()
      return new ResponseData<Conversation[]>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS)

    } catch (error) {
      return new ResponseData<Conversation[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);

    }

  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.conversationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateConversationDto: UpdateConversationDto) {
  //   return this.conversationService.update(+id, updateConversationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.conversationService.remove(+id);
  // }
}
