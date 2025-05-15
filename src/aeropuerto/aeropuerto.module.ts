import { Module } from '@nestjs/common';
import { AeropuertoEntity } from './aeropuerto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoService } from './aeropuerto.service';

@Module({
    imports: [TypeOrmModule.forFeature([AeropuertoEntity])],
    providers: [AeropuertoService],
})
export class AeropuertoModule {}
