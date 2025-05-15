import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepo: Repository<AerolineaEntity>;
  let aeropuertoRepo: Repository<AeropuertoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AerolineaAeropuertoService,
        {
          provide: getRepositoryToken(AerolineaEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AeropuertoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepo = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepo = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
  });

  const aeropuerto = { id: '1', nombre: 'A', ciudad: 'X', pais: 'Y' } as AeropuertoEntity;
  const aerolinea = {
    id: '1',
    nombre: 'LATAM',
    descripcion: 'Compañía Aérea',
    fechaFundacion: new Date(),
    paginaWeb: 'https://latam.com',
    aeropuertos: [aeropuerto],
  } as AerolineaEntity;

  it('addAirportToAirline should add airport to airline', async () => {
    jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(aeropuerto);
    jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue({ ...aerolinea, aeropuertos: [] });
    jest.spyOn(aerolineaRepo, 'save').mockResolvedValue(aerolinea);

    const result = await service.addAirportToAirline('1', '1');
    expect(result.aeropuertos.length).toBe(1);
  });

  it('findAirportsFromAirline should return airports', async () => {
    jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(aerolinea);
    const result = await service.findAirportsFromAirline('1');
    expect(result).toEqual(aerolinea.aeropuertos);
  });

  it('findAirportFromAirline should return specific airport', async () => {
    jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(aeropuerto);
    jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(aerolinea);

    const result = await service.findAirportFromAirline('1', '1');
    expect(result).toEqual(aeropuerto);
  });

  it('updateAirportsFromAirline should add airport if not associated', async () => {
    jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(aeropuerto);
    jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue({ ...aerolinea, aeropuertos: [] });
    jest.spyOn(aerolineaRepo, 'save').mockResolvedValue(aerolinea);

    const result = await service.updateAirportsFromAirline('1', '1');
    expect(result.aeropuertos.length).toBe(1);
  });

  it('deleteAirportFromAirline should remove associated airport', async () => {
    jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(aeropuerto);
    jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue(aerolinea);
    jest.spyOn(aerolineaRepo, 'save').mockResolvedValue({
      ...aerolinea,
      aeropuertos: [],
    });

    await expect(service.deleteAirportFromAirline('1', '1')).resolves.toBeUndefined();
  });

  it('deleteAirportFromAirline should throw error if not associated', async () => {
    jest.spyOn(aeropuertoRepo, 'findOne').mockResolvedValue(aeropuerto);
    jest.spyOn(aerolineaRepo, 'findOne').mockResolvedValue({ ...aerolinea, aeropuertos: [] });

    await expect(service.deleteAirportFromAirline('1', '1')).rejects.toBeInstanceOf(BusinessLogicException);;
  });
});
