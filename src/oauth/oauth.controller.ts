import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { CreateOauthDto } from './dto/create-oauth.dto';
import { UpdateOauthDto } from './dto/update-oauth.dto';
import { LoginDto } from '../user/dto/login.dto';
import { ResponseData } from '../global/globalClass';
import { HttpStatus, HttpMessage } from '../global/globalEnum';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) { }

  @Post()
  create(@Body() createOauthDto: CreateOauthDto) {
    return this.oauthService.create(createOauthDto);
  }

  @Post("login")
  async login(@Body() createOauthDto: LoginDto): Promise<ResponseData<string>> {
    try {
      return new ResponseData<string>(await this.oauthService.log(createOauthDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS)
    } catch (error) {

    }
    return;
  }

  @Get()
  findAll() {
    return this.oauthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oauthService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOauthDto: UpdateOauthDto) {
    return this.oauthService.update(+id, updateOauthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oauthService.remove(+id);
  }
}
