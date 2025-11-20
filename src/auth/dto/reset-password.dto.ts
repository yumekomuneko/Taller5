import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  
  @ApiProperty({
    name: 'token',
    description: 'Token de recuperación de contraseña',
    example: '123456789'
  })
  @IsString({message: 'El token de recuperación de contraseña debe ser una cadena'})
  token: string;

  @ApiProperty({
    name: 'nueva contraseña',
    description: 'Nueva contraseña',
    example: '12345678'
  })
  @IsString({message: 'La contraseña debe ser una cadena'})
  @MinLength(6, {message: 'La contraseña debe tener al menos 6 caracteres'})
  newPassword: string;
}
