import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from './aerolinea.entity';
import { plainToInstance } from 'class-transformer';
import { AerolineaDto } from './aerolinea.dto';


@Controller('aerolinea')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
  constructor(private readonly aerolineaService: AerolineaService) {}

  @Get()
  async findAll() {
    return await this.aerolineaService.findAll();
  }

  @Get(':aerolineaId')
  async findOne(@Param('aerolineaId') aerolineaId: string) {
    return await this.aerolineaService.findOne(aerolineaId);
  }

  @Post()
  async create(@Body() createAerolineaDto: AerolineaDto) {
    const aerolinea: AerolineaEntity = plainToInstance(
      AerolineaEntity,
      createAerolineaDto,
    );
    return await this.aerolineaService.create(aerolinea);
  }

  @Put(':aerolineaId')
  async update(
    @Param('aerolineaId') aerolineaId: string,
    @Body() updateAerolineaDto: AerolineaDto,
  ) {
    const aerolinea: AerolineaEntity = plainToInstance(
      AerolineaEntity,
      updateAerolineaDto,
    );
    return await this.aerolineaService.update(aerolineaId, aerolinea);
  }

  @Delete(':aerolineaId')
  @HttpCode(204)
  async delete(@Param('aerolineaId') aerolineaId: string) {
    return await this.aerolineaService.delete(aerolineaId);
  }
}
