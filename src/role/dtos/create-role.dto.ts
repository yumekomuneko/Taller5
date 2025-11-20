import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateRoleDto {

    @ApiProperty({
        name: 'nombre',
        description: 'Nombre del rol',
        example: 'ADMIN'
    })
    @IsString()
    @MinLength(3)
    nombre: string;

    @ApiProperty({
        name: 'descripcion',
        description: 'Descripción del rol',
        example: 'Rol para administradores'
    })
    @IsOptional()
    @IsString()
    descripcion?: string;
}
