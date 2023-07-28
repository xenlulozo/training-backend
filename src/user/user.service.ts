import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Oauth } from '../oauth/entities/oauth.entity';
import { Geometry, Point } from 'geojson';
import { NewUserDto } from './dto/create-new-user.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class UserService {
  constructor(
    private readonly elSearchService: ElasticsearchService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) { }
  async create(createUserDto: NewUserDto) {
    const newUser: User = new User();

    if (!createUserDto.name || !createUserDto.password || !createUserDto.repass)
      return `params invalid`

    if (await this.usersRepository.findOne({ where: { name: createUserDto.name } })) {
      return `user exist in db`
    }
    if (createUserDto.password! !== createUserDto.repass) {
      return `password is not match`
    }
    newUser.name = createUserDto.name;
    newUser.password = createUserDto.password
    if (createUserDto.lng && createUserDto.lat) {
      newUser.lat = createUserDto.lat;
      newUser.lng = createUserDto.lng;
    }
    console.log(newUser)
    try {

      const a = this.usersRepository.create(newUser);
      await this.usersRepository.save(a)

      await this.elSearchService.index({
        index: 'user',
        document: { ...newUser },
      });
      return 'sign up success';
    } catch (error) {
      return 'sign up failed';
    }
  }
  async log(loginDto: LoginDto) {
    const name = loginDto.name
    const pass = loginDto.password

    const user = await this.usersRepository.findOneBy({ name });
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.user_id, name: user.name };
    // const access_token = await this.jwtService.signAsync(payload)

    // return { message: "login is success" }
    // const a = this.usersRepository.update(newUser);
    // await this.usersRepository.save(a)
    const access_token = await this.jwtService.signAsync(payload);

    // const auth = this.authRepository.findOneBy({id});



    return {

    };



    // if (await this.checkExistAccount(name)) {
    //   if (await this.checkExistPassword(name, pass)) {
    //     return "login is success"

    //   }
    //   return "password is correct"
    // }
    // return "user isnt exist in db"
  }
  async checkExistAccount(name: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ name })
    return user
  }
  async checkExistPassword(name: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ name: name, password: password })
    return user
  }
  findAll(): Promise<User[]> {
    return this.usersRepository.find({ select: ['name', 'password'], });
  }

  async findLocation(): Promise<User[]> {

    const users = await this.usersRepository
      .createQueryBuilder('user')
      .where('lat <> \'\' AND lng <> \'\' AND lat IS NOT NULL AND lng IS NOT NULL')
      .select(['user.user_id', 'user.name'])
      .addSelect(
        `(6371 * 2 * ASIN(
        SQRT(
          POWER(SIN((RADIANS(lat::numeric) - RADIANS(10.84461557335749)) / 2), 2) +
          COS(RADIANS(lat::numeric)) * COS(RADIANS(10.84461557335749)) * POWER(SIN((RADIANS(lng::numeric) - RADIANS(106.69648806119311)) / 2), 2)
        )
      ))`,
        'distance'
      )
      .orderBy('distance')
      .limit(5)
      .getRawMany();
    // newLocation.map((item) => {
    //   if (this.haversineDistance(Number(item.lat), Number(item.lng), myLat, myLng))
    //     resuilt.push({
    //       id: item.user_id,
    //       name: item.name,
    //       distance: `${this.haversineDistance(Number(item.lat), Number(item.lng), myLat, myLng).toFixed(2)} Km`
    //     })
    // })


    // console.log(users)
    return users;
  }
  // async rada(lat: number, lng: number, radius: number): Promise<User[]> {
  //   return this.usersRepository
  //     .createQueryBuilder()
  //     .where(
  //       `ST_DWithin(ST_MakePoint(:lng, :lat), ST_MakePoint(lng, lat), :radius)`,
  //       { lat, lng, radius },
  //     )
  //     .getMany();
  // }
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const R = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  findOne(user_id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ user_id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
