import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JsonService } from './json.service';
import { CreateJsonDto } from './dto/create-json.dto';
import { UpdateJsonDto } from './dto/update-json.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('json')
export class JsonController {
  constructor(private readonly jsonService: JsonService) {}

  @Post()
  create(@Body() createJsonDto: CreateJsonDto) {
    return this.jsonService.create(createJsonDto);
  }

  @Get()
  findAll() {
    const locationPath = path.join(
      __dirname,
      '../../src/json/entities/location.seed.json',
    );
    const locationData = fs.readFileSync(locationPath, 'utf8');
    const location = JSON.parse(locationData);

    const subClinicPath = path.join(
      __dirname,
      '../../src/json/entities/subClinic.seed.json',
    );
    const subClinicData = fs.readFileSync(subClinicPath, 'utf8');
    const subClinic = JSON.parse(subClinicData);

    const setSubClinic = new Set<string>(subClinic.map((item) => item._id));

    const unmatchedSubClinicIds = subClinic
      .filter((subClinicItem) => {
        return !location.some(
          (locationItem) => locationItem.subClinicRef === subClinicItem._id,
        );
      })
      .map((subClinicItem) => subClinicItem);

    const newLocation = unmatchedSubClinicIds.map((item) => {
      return {
        _id: uuidv4(),
        code: Number(item.code),
        name: `${item.name} ช่องที่ 1`,
        type: item.type,
        departmentRef: item.clinicRef,
        subClinicRef: item._id,
      };
    });
    const sumLocation = [...location, ...newLocation];
    const finit = sumLocation.map((item) => {
      let type = item.type;
      if (!type) {
        const subClinicItem = subClinic.find(
          (sub) => sub._id === item.subClinicRef,
        );
        if (subClinicItem) {
          type = subClinicItem.type;
        }
      }
      return {
        _id: item._id,
        ...item,
        type: type,
      };
    });
    fs.writeFileSync(
      path.join(__dirname, '../../src/json/entities/newLocation.seed.json'),
      JSON.stringify(finit, null, 2),
    );
    return finit;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jsonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJsonDto: UpdateJsonDto) {
    return this.jsonService.update(+id, updateJsonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jsonService.remove(+id);
  }
}
