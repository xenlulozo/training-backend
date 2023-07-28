import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateOauthDto } from './dto/create-oauth.dto';
import { UpdateOauthDto } from './dto/update-oauth.dto';
import { LoginDto } from 'src/user/dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Oauth } from './entities/oauth.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class OauthService {
  constructor(
    private readonly elSearchService: ElasticsearchService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Oauth)
    private authRepository: Repository<Oauth>,
    private jwtService: JwtService
  ) { }
  create(createOauthDto: CreateOauthDto) {
    return `This action adds a new oauth ${createOauthDto.user_id}`;
  }

  async log(loginDto: LoginDto): Promise<string | null> {
    const name = loginDto.name
    const pass = loginDto.password

    const user = await this.usersRepository.findOneBy({ name });
    if (!user)
      return `account invalid`
    const user_id = user.user_id

    const checkExist = await this.authRepository.findOneBy({ user_id })

    if (user.password !== pass) {
      return `password is not correct`

    }
    if (checkExist?.access_token) {
      return `you are login already`
    }

    const payload = { sub: user.user_id, name: user.name };
    const access_token = await this.jwtService.signAsync(payload);

    const auth = new Oauth();
    auth.access_token = access_token;
    auth.user_id = user.user_id
    try {
      // const a = this.usersRepository.create(newUser);
      await this.authRepository.save(auth)
      await this.elSearchService.index({
        index: 'oauth',
        document: { ...auth },
      });
      return `login success ${access_token}`;
    } catch (error) {

      return 'login failed';
    }


  }

  async findAll() {
    return `This action returns all oauth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} oauth`;
  }

  update(id: number, updateOauthDto: UpdateOauthDto) {
    return `This action updates a #${id} oauth`;
  }

  remove(id: number) {
    return `This action removes a #${id} oauth`;
  }
}
