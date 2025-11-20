import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({name: 'correo electrónico',
                description: 'correo electrónico registrado en el sistema', 
                type: String, 
                example: 'admin@mail.com'})
  @IsEmail({}, {message: 'Debe ser un correo electrónico válido'})
  email: string;

  @ApiProperty({
    name: 'contraseña de ingreso',
    description: 'Contraseña de Usuario, debe tener al menos 6 caracteres',
    example: 'Admin1245'
  })
  @IsString({message: 'La contraseña debe tener al menos 6 caracteres'})
  @MinLength(6, {message: 'La contraseña debe tener al menos 6 caracteres'})
  password: string;
}
