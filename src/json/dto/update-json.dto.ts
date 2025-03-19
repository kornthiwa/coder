import { PartialType } from '@nestjs/mapped-types';
import { CreateJsonDto } from './create-json.dto';

export class UpdateJsonDto extends PartialType(CreateJsonDto) {}
