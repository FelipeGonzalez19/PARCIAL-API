import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuerto: AeropuertoEntity;

  const seedDatabase = async () => {
    await repository.clear();
    aeropuerto = await repository.save({
      nombre: faker.company.name(),
      codigo: 'ABC',
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: [],
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });

  it('findAll should return all aeropuertos', async () => {
    const result = await service.findAll();
    expect(result.length).toBeGreaterThan(0);
  });

  it('findOne should return a aeropuerto by id', async () => {
    const result = await service.findOne(aeropuerto.id);
    expect(result).not.toBeNull();
    expect(result.nombre).toBe(aeropuerto.nombre);
  });

  it('findOne should throw an exception for invalid id', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', 'The aeropuerto with the given id was not found');
  });

  it('create should successfully create a aeropuerto with valid 3-letter code', async () => {
    const newAero: Partial<AeropuertoEntity> = {
      nombre: faker.company.name(),
      codigo: 'XYZ',
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: [],
    };
    const result = await service.create(newAero as AeropuertoEntity);
    expect(result).not.toBeNull();
    expect(result.codigo).toBe('XYZ');
  });

  it('create should throw exception for invalid codigo', async () => {
    const newAero = {
      nombre: faker.company.name(),
      codigo: 'LONGCODE',
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: [],
    };
    await expect(() => service.create(newAero as unknown as AeropuertoEntity))
      .rejects.toHaveProperty('message', 'El código del aeropuerto debe tener exactamente 3 caracteres');
  });

  it('update should update a aeropuerto with valid 3-letter code', async () => {
    const updated = { ...aeropuerto, nombre: 'Nuevo Nombre', codigo: 'DEF' };
    const result = await service.update(aeropuerto.id, updated);
    expect(result.nombre).toBe('Nuevo Nombre');
    expect(result.codigo).toBe('DEF');
  });

  it('update should throw exception for invalid codigo', async () => {
    const updated = { ...aeropuerto, codigo: 'XXXX' };
    await expect(() => service.update(aeropuerto.id, updated))
      .rejects.toHaveProperty('message', 'El código del aeropuerto debe tener exactamente 3 caracteres');
  });

  it('update should throw exception for non-existing aeropuerto', async () => {
    await expect(() => service.update('0', aeropuerto))
      .rejects.toHaveProperty('message', 'El aeropuerto con el id dado no fue encontrado');
  });

  it('delete should remove a aeropuerto', async () => {
    await service.delete(aeropuerto.id);
    const result = await repository.findOne({ where: { id: aeropuerto.id } });
    expect(result).toBeNull();
  });

  it('delete should throw exception for non-existing aeropuerto', async () => {
    await expect(() => service.delete('0'))
      .rejects.toHaveProperty('message', 'The aeropuerto with the given id was not found');
  });
});