import { IsString, IsNotEmpty, IsDateString, IsUrl } from 'class-validator';

export class AerolineaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsDateString()
  @IsNotEmpty()
  fechaFundacion: string;

  @IsString()
  @IsNotEmpty()
  paginaWeb: string;
}