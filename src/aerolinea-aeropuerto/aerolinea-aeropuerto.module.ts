import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';


@Module({
    imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
    providers: [AerolineaAeropuertoService],
    exports: [AerolineaAeropuertoService],
    controllers: [AerolineaAeropuertoController],
})
export class AerolineaAeropuertoModule {}
