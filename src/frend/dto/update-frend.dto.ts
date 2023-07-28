import { PartialType } from '@nestjs/mapped-types';
import { CreateFrendDto } from './create-frend.dto';

export class UpdateFrendDto extends PartialType(CreateFrendDto) {}
