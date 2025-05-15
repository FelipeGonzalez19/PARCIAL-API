import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AerolineaAeropuertoService {
  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepo: Repository<AerolineaEntity>,

    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepo: Repository<AeropuertoEntity>,
  ) {}

  // 1. AddAirportToAirline
  async addAirportToAirline(
    aerolineaId: string,
    aeropuertoId: string,
  ): Promise<AerolineaEntity> {
    const aeropuerto = await this.aeropuertoRepo.findOne({
      where: { id: aeropuertoId },
    });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const aerolinea = await this.aerolineaRepo.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'La aerolinea gastronomica no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
    return await this.aerolineaRepo.save(aerolinea);
  }

  // 2. findAirportFromAirline
  async findAirportsFromAirline(
    aerolineaId: string,
  ): Promise<AeropuertoEntity[]> {
    const aerolinea = await this.aerolineaRepo.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'La aerolinea no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    return aerolinea.aeropuertos;
  }

  // 3. findAirportFromAirline
  async findAirportFromAirline(
    aerolineaId: string,
    aeropuertoId: string,
  ): Promise<AeropuertoEntity> {
    const aeropuerto = await this.aeropuertoRepo.findOne({
      where: { id: aeropuertoId },
    });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const aerolinea = await this.aerolineaRepo.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'La aerolinea no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const found = aerolinea.aeropuertos.find((p) => p.id === aeropuerto.id);
    if (!found)
      throw new BusinessLogicException(
        'El aeropuerto no está asociado a la aerolinea',
        BusinessError.PRECONDITION_FAILED,
      );

    return found;
  }

  // 4. updateAirportsFromAirline
  async updateAirportsFromAirline(
    aerolineaId: string,
    aeropuertoId: string,
  ): Promise<AerolineaEntity> {
    const aeropuerto = await this.aeropuertoRepo.findOne({
      where: { id: aeropuertoId },
    });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const aerolinea = await this.aerolineaRepo.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'La aerolinea gastronomica no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const found = aerolinea.aeropuertos.some((a) => a.id === aeropuerto.id);
    if (!found) {
      aerolinea.aeropuertos.push(aeropuerto);
    }

    return await this.aerolineaRepo.save(aerolinea);
  }

  // 5. deleteAirportFromAirline
  async deleteAirportFromAirline(
    aerolineaId: string,
    aeropuertoId: string,
  ): Promise<void> {
    const aeropuerto = await this.aeropuertoRepo.findOne({
      where: { id: aeropuertoId },
    });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const aerolinea = await this.aerolineaRepo.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'La aerolinea gastronomica no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const aeropuertoAsociado = aerolinea.aeropuertos.find(
      (p) => p.id === aeropuerto.id,
    );
    if (!aeropuertoAsociado)
      throw new BusinessLogicException(
        'El aeropuerto no está asociado a la aerolinea',
        BusinessError.PRECONDITION_FAILED,
      );

    aerolinea.aeropuertos = aerolinea.aeropuertos.filter(
      (p) => p.id !== aeropuertoId,
    );
    await this.aerolineaRepo.save(aerolinea);
  }
}
