import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FrendService } from './frend.service';
import { CreateFrendDto } from './dto/create-frend.dto';
import { UpdateFrendDto } from './dto/update-frend.dto';
import { ResponseData } from '../global/globalClass';
import { HttpStatus, HttpMessage } from '../global/globalEnum';

@Controller('frend')
export class FrendController {
  constructor(private readonly frendService: FrendService) { }

  @Post()
  async create(@Body() createFrendDto: CreateFrendDto): Promise<ResponseData<string>> {
    try {
      return new ResponseData<string>(await this.frendService.create(createFrendDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS)

    } catch (error) {
      return new ResponseData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR)

    }

  }

  @Get()
  findAll() {
    return this.frendService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.frendService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFrendDto: UpdateFrendDto) {
    return this.frendService.update(+id, updateFrendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.frendService.remove(+id);
  }
}
