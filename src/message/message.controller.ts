import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtService } from '@nestjs/jwt';
import { ResponseData } from 'src/global/globalClass';
import { HttpStatus, HttpMessage } from '../global/globalEnum';
import { Message } from './entities/message.entity';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService,) { }

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto): Promise<ResponseData<string>> {
    try {
      const result = await this.messageService.create(createMessageDto)
      return new ResponseData<string>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS)
    } catch (error) {
      return new ResponseData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR)

    }

    // return ;
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseData<Message[] | string>> {
    try {
      const result = await this.messageService.findOne(+id);
      return new ResponseData<Message[] | string>(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS)
    } catch (error) {
      return new ResponseData<Message[] | string>(null, HttpStatus.ERROR, HttpMessage.ERROR)
    }


  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
