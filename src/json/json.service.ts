import { Injectable } from '@nestjs/common';
import { CreateJsonDto } from './dto/create-json.dto';
import { UpdateJsonDto } from './dto/update-json.dto';

@Injectable()
export class JsonService {
  create(createJsonDto: CreateJsonDto) {
    return 'This action adds a new json';
  }

  findAll() {
    return `This action returns all json`;
  }

  findOne(id: number) {
    return `This action returns a #${id} json`;
  }

  update(id: number, updateJsonDto: UpdateJsonDto) {
    return `This action updates a #${id} json`;
  }

  remove(id: number) {
    return `This action removes a #${id} json`;
  }
}
