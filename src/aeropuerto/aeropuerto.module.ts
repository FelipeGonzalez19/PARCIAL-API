import { Module } from '@nestjs/common';
import { AeropuertoEntity } from './aeropuerto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoController } from './aeropuerto.controller';

@Module({
    imports: [TypeOrmModule.forFeature([AeropuertoEntity])],
    providers: [AeropuertoService],
    controllers: [AeropuertoController],
})
export class AeropuertoModule {}
