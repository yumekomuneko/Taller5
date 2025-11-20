import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

    @ApiProperty({
        name: 'nombre',
        description: 'Nombre del usuario',
        example: 'Sofia'
    })
    @IsString()
    nombre: string;

    @ApiProperty({
        name: 'apellido',
        description: 'Apellido del usuario',
        example: 'Aponte'
    })
    @IsString()
    apellido: string;

    @ApiProperty({
        name: 'email',
        description: 'Correo electrónico del usuario',
        example: 'apontemurciamateo@gmail.com'
    })
    @IsEmail({}, {message: 'Debe ser un correo electrónico válido'})
    email: string;

    @ApiProperty({
        name: 'telefono',
        description: 'Telefono del usuario',
        example: '32000000'
    })
    @IsOptional({message: 'El telefono es opcional'})
    @IsString()
    telefono?: string;

    @ApiProperty({
        name: 'password',
        description: 'Contraseña del usuario',
        example: '12345678'
    })
    @IsString()
    @MinLength(6, {message: 'La contraseña debe tener al menos 6 caracteres'})
    password: string;

    @ApiProperty({
        name: 'role',
        description: 'Rol del usuario',
        example: 'admin'
    })
    @IsOptional({message: 'El rol es opcional, para usuarios no administradores'})
    @IsEnum(UserRole, {message: 'El rol debe ser un valor válido'})
    role?: UserRole;
}
