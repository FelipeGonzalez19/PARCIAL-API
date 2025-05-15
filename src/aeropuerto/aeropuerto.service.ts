import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { AeropuertoEntity } from './aeropuerto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AeropuertoService {
  constructor(
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
  ) {}

  async findAll(): Promise<AeropuertoEntity[]> {
    return await this.aeropuertoRepository.find({
      relations: ['aerolineas'],
    });
  }

  async findOne(id: string): Promise<AeropuertoEntity> {
    const aeropuerto: AeropuertoEntity | null =
      await this.aeropuertoRepository.findOne({
        where: { id },
        relations: ['aerolineas'],
      });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'The aeropuerto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return aeropuerto;
  }

  async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
    if (!aeropuerto.codigo || aeropuerto.codigo.length !== 3) {
      throw new BusinessLogicException(
        'El código del aeropuerto debe tener exactamente 3 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.aeropuertoRepository.save(aeropuerto);
  }

  async update(
    id: string,
    aeropuerto: AeropuertoEntity,
  ): Promise<AeropuertoEntity> {
    const persistedaeropuerto: AeropuertoEntity | null =
      await this.aeropuertoRepository.findOne({
        where: { id },
      });

    if (!persistedaeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    if (!aeropuerto.codigo || aeropuerto.codigo.length !== 3) {
      throw new BusinessLogicException(
        'El código del aeropuerto debe tener exactamente 3 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.aeropuertoRepository.save({
      ...persistedaeropuerto,
      ...aeropuerto,
    });
  }

  async delete(id: string) {
    const aeropuerto: AeropuertoEntity | null =
      await this.aeropuertoRepository.findOne({
        where: { id },
      });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'The aeropuerto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.aeropuertoRepository.remove(aeropuerto);
  }
}
