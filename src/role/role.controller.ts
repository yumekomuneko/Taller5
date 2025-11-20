import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
//@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @ApiResponse({
        status: 201,
        description: 'Obtener todos los roles',
        type: Object,
        content: {
            'application/json': {
                example: {
                    message: 'Roles obtenidos',
                    data: [
                        {
                            id: 1,
                            nombre: "ADMIN",
                            descripcion: "Rol para administradores"
                        },
                        {
                            id: 2,
                            nombre: "USER",
                            descripcion: "Rol para usuarios"
                        }
                    ],
                },
            }  
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de creación incorrectos o campos vacíos',
        type: Object,
        content: {
            'application/json': {
                example: {
                    rolDuplicado: "El nombre del rol ya existe",
                    value: {
                        statusCode: 400,
                        message: "Datos de creación no válidos, rol duplicado",
                        error: "Bad request"
                    },
                    errorFormato: {
                        summary: 'Formato de datos incorrectos',
                        value: {
                            statusCode: 400,
                            message: [
                                'el nombre del rol no es válido',
                                'la descripción del rol no es válida',
                            ],
                            error: 'Bad request',
                        }
                    }
                },
            }  
        },
    })
    //@Roles(UserRole.ADMIN)
    @Get()
    findAll() {
        return this.roleService.findAll();
    }

    @ApiResponse({
        status: 201,
        description: 'Role id:1 obtenido exitosamente',
        type: Object,
        content: {
            'application/json': {
                example: {
                    message: 'Role obtenido exitosamente',
                    data: {
                        id: 1,
                        nombre: "ADMIN",
                        descripcion: "Rol para administradores"
                    },
                },
            }  
        },
      })
      @ApiResponse({
        status: 400,
        description: 'Datos insertados incorrectos o rol no encontrado',
        type: Object,
        content: {
            'application/json': {
                example: {
                    coreoDuplicado: "El rol ya existe",
                    value: {
                        statusCode: 400,
                        message: "Datos de creación incorrectos rol duplicado",
                        error: "Bad request"
                    },
                    errorFormato: {
                        summary: 'Formato de datos incorrectos',
                        value: {
                            statusCode: 400,
                            message: [
                                'nombre del rol no es válido',
                                'descripción del rol no es válida',
                            ],
                            error: 'Bad request',
                    } 
                },
            }  
        },
        }
      })
    //@Roles(UserRole.ADMIN)
    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.create(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Role actualizado exitosamente',
        type: Object,
        content: {
            'application/json': {
                example: {
                    message: 'Role actualizado exitosamente',
                    data: {
                        id: 1,
                        nombre: "ADMIN",
                        descripcion: "Rol para administradores"
                    },
                },
            }  
        },
      })
      @ApiResponse({
        status: 400,
        description: 'Datos actualizados incorrectos o campos vacíos',
        type: Object,
        content: {
            'application/json': {
                example: {
                    coreoDuplicado: "El rol ya existe",
                    value: {
                        statusCode: 400,
                        message: "Datos de creación incorrectos rol duplicado",
                        error: "Bad request"
                    },
                    errorFormato: {
                        summary: 'Formato de datos incorrectos',
                        value: {
                            statusCode: 400,
                            message: [
                                'nombre del rol no es válido',
                                'descripción del rol no es válida',
                            ],
                            error: 'Bad request',
                        }
                    }
                },
            }  
        },
    })
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRoleDto,
    ) {
        return this.roleService.update(id, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Rol eliminado exitosamente',
        type: Object,
        content: {
            'application/json': {
                example: {
                    message: 'Rol eliminado exitosamente',
                    data: {
                        id: 1,
                        nombre: "ADMIN",
                        descripcion: "Rol para administradores"
                    },
                },
            }  
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Datos eliminados incorrectos o campos vacíos',
        type: Object,
        content: {
            'application/json': {
                example: {
                    coreoDuplicado: "El rol ya existe",
                    value: {
                        statusCode: 400,
                        message: "Datos de creación incorrectos rol duplicado",
                        error: "Bad request"
                    },
                    errorFormato: {
                        summary: 'Formato de datos incorrectos',
                        value: {
                            statusCode: 400,
                            message: [
                                'nombre del rol no es válido',
                                'descripción del rol no es válida',
                            ],
                            error: 'Bad request',
                        }
                    }
                },
            }  
        },
    })
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.roleService.remove(id);
    }
}
