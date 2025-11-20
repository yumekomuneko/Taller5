import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({name: 'correo electrónico',
                description: 'correo electrónico del usuario', 
                type: String, 
                example: 'admin@mail.com'})
  @IsEmail({}, {message: 'Debe ser un correo electrónico válido'})
  @IsNotEmpty({message: 'Correo electrónico es requerido'})
  email: string;

  @ApiProperty({
    name: 'contraseña de ingreso',
    description: 'Contraseña de Usuario, debe tener al menos 6 caracteres',
    example: 'Admin1245'
  })
  @IsString({message: 'La contraseña debe ser una cadena'})
  @MinLength(6, {message: 'La contraseña debe tener al menos 6 caracteres'})
  @IsNotEmpty( {message: 'La contraseña es requerida'})
  password: string;

  @ApiProperty({
    name: 'nombre',
    description: 'Nombre del usuario',
    example: 'Sofia'
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    name: 'apellido',
    description: 'Apellido del usuario',
    example: 'Aponte'
  })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({
    name: 'telefono',
    description: 'Telefono del usuario',
    example: '32000000'
  })
  @IsString({message: 'El telefono debe ser una cadena'})
  @IsOptional({message: 'El telefono es opcional'})
  telefono: string;

  @ApiProperty({
    name: 'rol',
    description: 'Rol del usuario',
    example: 'admin'
  })
  @IsString({message: 'El rol debe ser una cadena'})
  @IsOptional({message: 'El rol es opcional, para usuarios no administradores'})
  role: string;
}
