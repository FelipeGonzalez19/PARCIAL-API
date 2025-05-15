import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

@Controller('aerolinea-aeropuerto')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {
  constructor(
    private readonly aerolineaAeropuertoService: AerolineaAeropuertoService,
  ) {}

  
  @Post(':aerolineaId/aeropuertos/:aeropuertoId')
  async addAirportToAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string,
  ) {
    return await this.aerolineaAeropuertoService.addAirportToAirline(
      aerolineaId,
      aeropuertoId,
    );
  }

  
  @Get(':aerolineaId/aeropuertos')
  async findAirportsFromAirline(@Param('aerolineaId') aerolineaId: string) {
    return await this.aerolineaAeropuertoService.findAirportsFromAirline(
      aerolineaId,
    );
  }

  
  @Get(':aerolineaId/aeropuertos/:aeropuertoId')
  async findAirportFromAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string,
  ) {
    return await this.aerolineaAeropuertoService.findAirportFromAirline(
      aerolineaId,
      aeropuertoId,
    );
  }

  
  @Put(':aerolineaId/aeropuertos/:aeropuertoId')
  async updateAirportsFromAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string,
  ) {
    return await this.aerolineaAeropuertoService.updateAirportsFromAirline(
      aerolineaId,
      aeropuertoId,
    );
  }

  
  @Delete(':aerolineaId/aeropuertos/:aeropuertoId')
  @HttpCode(204)
  async deleteAirportFromAirline(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string,
  ) {
    return await this.aerolineaAeropuertoService.deleteAirportFromAirline(
      aerolineaId,
      aeropuertoId,
    );
  }
}
