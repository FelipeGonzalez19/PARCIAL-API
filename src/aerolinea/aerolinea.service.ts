import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { isBefore } from 'date-fns';

@Injectable()
export class AerolineaService {
  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepository: Repository<AerolineaEntity>,
  ) {}

  async findAll(): Promise<AerolineaEntity[]> {
    return await this.aerolineaRepository.find({
      relations: ['aeropuertos'],
    });
  }

  async findOne(id: string): Promise<AerolineaEntity> {
    const aerolinea: AerolineaEntity | null = await this.aerolineaRepository.findOne({
      where: { id },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'The aerolinea with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return aerolinea;
  }

async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
  if (!isBefore(aerolinea.fechaFundacion, new Date())) {
    throw new BusinessLogicException(
      'La fecha de fundación debe ser una fecha pasada',
      BusinessError.PRECONDITION_FAILED,
    );
  }

  return await this.aerolineaRepository.save(aerolinea);
}

async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
  const persistedaerolinea = await this.aerolineaRepository.findOne({
    where: { id },
  });

  if (!persistedaerolinea) {
    throw new BusinessLogicException(
      'La aerolínea con el id proporcionado no fue encontrada',
      BusinessError.NOT_FOUND,
    );
  }

  if (aerolinea.fechaFundacion && !isBefore(aerolinea.fechaFundacion, new Date())) {
    throw new BusinessLogicException(
      'La fecha de fundación debe ser una fecha pasada',
      BusinessError.PRECONDITION_FAILED,
    );
  }

  return await this.aerolineaRepository.save({ ...persistedaerolinea, ...aerolinea });
}

  async delete(id: string) {
    const aerolinea: AerolineaEntity | null = await this.aerolineaRepository.findOne({
      where: { id },
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'The aerolinea with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.aerolineaRepository.remove(aerolinea);
  }
}
