import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolinea: AerolineaEntity;

  const seedDatabase = async () => {
    await repository.clear();
    aerolinea = await repository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
      aeropuertos: [],
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));

    await seedDatabase();
  });

  it('findAll should return all aerolineas', async () => {
    const result = await service.findAll();
    expect(result).not.toBeNull();
    expect(result.length).toBeGreaterThan(0);
  });

  it('findOne should return a valid aerolinea', async () => {
    const result = await service.findOne(aerolinea.id);
    expect(result).not.toBeNull();
    expect(result.nombre).toBe(aerolinea.nombre);
  });

  it('findOne should throw exception for invalid id', async () => {
    await expect(() => service.findOne('0'))
      .rejects.toBeInstanceOf(BusinessLogicException);
  });

  it('create should insert a new valid aerolinea', async () => {
    const newAerolinea = {
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
      aeropuertos: [],
    };
    const result = await service.create(newAerolinea as unknown as AerolineaEntity);
    expect(result).not.toBeNull();
    expect(result.nombre).toBe(newAerolinea.nombre);
  });

  it('create should throw exception if fechaFundacion is in the future', async () => {
    const newAerolinea = {
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.future(),
      paginaWeb: faker.internet.url(),
      aeropuertos: [],
    };

    await expect(() => service.create(newAerolinea as unknown as AerolineaEntity))
      .rejects.toBeInstanceOf(BusinessLogicException);
  });

  it('update should modify a valid aerolinea', async () => {
    const updated = { ...aerolinea, nombre: 'Nuevo Nombre' };
    const result = await service.update(aerolinea.id, updated);
    expect(result.nombre).toBe('Nuevo Nombre');
  });

  it('update should throw exception if aerolinea not found', async () => {
    await expect(() => service.update('0', aerolinea))
      .rejects.toBeInstanceOf(BusinessLogicException);
  });

  it('update should throw exception if fechaFundacion is in the future', async () => {
    const updated = { ...aerolinea, fechaFundacion: faker.date.future() };
    await expect(() => service.update(aerolinea.id, updated))
      .rejects.toBeInstanceOf(BusinessLogicException);
  });

  it('delete should remove a valid aerolinea', async () => {
    await service.delete(aerolinea.id);
    const result = await repository.findOne({ where: { id: aerolinea.id } });
    expect(result).toBeNull();
  });

  it('delete should throw exception if aerolinea not found', async () => {
    await expect(() => service.delete('0'))
      .rejects.toBeInstanceOf(BusinessLogicException);
  });
});