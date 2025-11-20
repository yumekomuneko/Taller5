import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    UseGuards,
    Request,
    ForbiddenException,
    Post,
    Delete
    , HttpStatus
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { Public } from '../auth/decorators/public.decorator';
import { ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    /** Obtener datos del usuario autenticado */
    @ApiResponse({
        status: 200,
        description: 'Ingreso a mi perfil',
        type: Object,
        content: {
            'application/json': {
                example: {
                    message: 'Ingreso a mi perfil',
                    data: {
                        id: 1,
                        nombre: "Sofia",
                        apellido: "Aponte",
                        email: "apontemurciamateo@gmail.com",
                        telefono: "32000000",
                        password: "12345678",
                        role: "admin"
                    },
                },
            }  
        },
    })
    @ApiResponse({
        status: 401,
        description: 'No se ha podido ingresar a mi perfil',
        type: Object,
        content: {
            'application/json': {
                example: {
                    errorFormato: {
                        summary: 'Formato de datos incorrectos',
                        value: {
                            statusCode: 400,
                            message: [
                                'nombre El nombre no es válido',
                                'apellido La apellido no es válido',
                                'email El correo electrónico no es válido',
                                'telefono El telefono no es válido',
                                'password La contraseña no es válida',
                                'role El rol no es válido',
                            ],
                            error: 'Bad request',
                        }
                    }
                },
            }  
        },
    })
    @Get('profile')
    async getProfile(@Request() req: any) {
        const user = await this.userService.findOne(req.user.userId);
        if (!user) throw new ForbiddenException('Usuario no encontrado');
        return user;
    }

    /** Obtener todos los usuarios (solo ADMIN) */
    @ApiResponse({
        status: 200,
        description: 'Obtener todos los usuarios',
        type: Object,
        content: {
            'application/json': {
                example: {
                    message: 'Obtener todos los usuarios',
                    data: [
                        {
                            id: 1,
                            nombre: "Sofia",
                            apellido: "Aponte",
                            email: "apontemurciamateo@gmail.com",
                            telefono: "32000000",
                            password: "12345678",
                            role: "admin"
                        },
                        {
                            id: 2,
                            nombre: "Sofia",
                            apellido: "Aponte",
                            email: "apontemurciamateo@gmail.com",
                            telefono: "32000000",
                            password: "12345678",
                            role: "admin"
                        },
                        {
                            id: 3,
                            nombre: "Sofia",
                            apellido: "Aponte",
                            email: "apontemurciamateo@gmail.com",
                            telefono: "32000000",
                            password: "12345678",
                            role: "admin"
                        },
                        {
                            id: 4,
                            nombre: "Sofia",
                            apellido: "Aponte",
                            email: "apontemurciamateo@gmail.com",
                            telefono: "32000000",
                            password: "12345678",
                            role: "admin"
                        },
                        {
                            id: 5,
                            nombre: "Sofia",
                            apellido: "Aponte",
                            email: "apontemurciamateo@gmail.com",
                            telefono: "32000000",
                            password: "12345678",
                            role: "admin"
                        },
                        {
                            id: 6,
                            nombre: "Sofia",
                            apellido: "Aponte",
                            email: "apontemurciamateo@gmail.com",
                            telefono: "32000000",
                            password: "12345678",
                            role: "admin"
                        },
                        {
                            id: 7,
                            nombre: "Sofia",
                            apellido: "Aponte",
                            email: "apontemurciamateo@gmail.com",
                            telefono: "32000000",
                            password: "12345678",
                            role: "admin"
                        },
                        {
                            id: 8,
                            nombre: "Sofia",
                            apellido: "Aponte",
                            email: "apontemurciamateo@gmail.com",
                            telefono: "32000000",
                            password: "12345678",
                            role: "admin"
                        },
                    ],
                },
            }  
        },
    })
    @ApiResponse({
        status: 401,
        description: 'No se han encontrado los usuarios',
        type: Object,
        content: {
            'application/json': {
                example: {
                    errorFormato: {
                        summary: 'Formato de datos incorrectos',
                        value: {
                            statusCode: 400,
                            message: [
                                'No se han encontrado los usuarios',
                                'Error al intentar obtener los usuarios',
                                'No hay usuarios registrados',
                            ],
                            error: 'Bad request',
                        }
                    }
                }
            }
        },
        })
    @Get()
    @Roles(UserRole.ADMIN)
    async findAll() {
        return this.userService.findAll();
    }

    /** Obtener usuario por ID (solo ADMIN) */
    @ApiResponse({
        status: 200,
        description: 'Obtener usuario por ID',
        type: Object,
        content: {
            'application/json': {
                example: {
                    message: 'Obtener usuario por ID',
                    data: {
                        id: 1,
                        nombre: "Sofia",
                        apellido: "Aponte",
                        email: "apontemurciamateo@gmail.com",
                        telefono: "32000000",
                        password: "12345678",
                        role: "admin"
                    },
                },
            }  
        },
      })
      @ApiResponse({
        status: 401,
        description: 'No se ha encontrado el usuario',
        type: Object,
        content: {
            'application/json': {
                example: {
                    errorFormato: {
                        summary: 'Formato de datos incorrectos',
                        value: {
                            statusCode: 400,
                            message: [
                                'No se ha encontrado el usuario',
                                'Error al intentar obtener el usuario',
                                'No hay usuarios registrados',
                            ],
                            error: 'Bad request',
                        }
                    }
                },
            }  
        },
    })
    @Get(':id')
    @Roles(UserRole.ADMIN)
    async findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @ApiBody({ type: CreateUserDto,
        description: 'Crear nuevo usuario',
        required: true,
        examples: {
            exitoso: {
                summary: 'Crear nuevo usuario exitoso',
                value: {
                    nombre: "Sofia",
                    apellido: "Aponte",
                    email: "apontemurciamateo@gmail.com",
                    telefono: "32000000",
                    password: "12345678",
                    role: "admin"
                },
            },
            errorFormato: {
                summary: 'Formato de datos incorrectos',
                value: {
                    nombre: "%Sofia",
                    apellido: "Aponte",
                    email: "apontemurciamateo@gmail.com",
                    telefono: "32000000",
                    password: "12345678",
                    role: "admin"
                },
            },
        }
     })
    @Post()
    @Public()
    async create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }
    



    /** Actualizar datos del usuario autenticado */
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Datos del usuario actualizados',
        type: UpdateUserDto,
        content: {
            'application/json': {
                example: {
                    message: 'Datos del usuario actualizados',
                    data: {
                        id: 1,
                        nombre: "Sofia",
                        apellido: "Aponte",
                        email: "apontemurciamateo@gmail.com",
                        telefono: "32000000",
                        password: "12345678",
                        role: "admin"
                    },
                },
            }  
        },
      })
      @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos de actualización incorrectos o campos vacíos',
        type: Object,
        content: {
            'application/json': {
                example: {
                    coreoDuplicado: "El nombre del usuario ya existe",
                    value: {
                        statusCode: 400,
                        message: "Datos de actualización incorrectos o campos vacíos",
                        error: "Bad request"
                    },
                    errorFormato: {
                        summary: 'Formato de datos incorrectos',
                        value: {
                            statusCode: 400,
                            message: [
                                'nombre El nombre no es válido',
                                'apellido La apellido no es válido',
                                'email El correo electrónico no es válido',
                                'telefono El telefono no es válido',
                                'password La contraseña no es válida',
                                'role El rol no es válido',
                            ],
                            error: 'Bad request',
                        }
                    }
                },
            }  
        },  
    })

    @Patch('update')
    async updateProfile(@Request() req: any, @Body() dto: UpdateUserDto) {
        return this.userService.update(req.user.userId, dto);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Datos del usuario actualizados',
        type: UpdateUserDto,
        content: {
            'application/json': {
                example: {
                    message: 'Datos del usuario actualizados',
                    data: {
                        id: 1,
                        nombre: "Sofia",
                        apellido: "Aponte",
                        email: "apontemurciamateo@gmail.com",
                        telefono: "32000000",
                        password: "12345678",
                        role: "admin"
                    },
                },
            }  
        },
      })
      @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos de actualización incorrectos o campos vacíos',
        type: Object,
        content: {
            'application/json': {
                example: {
                    coreoDuplicado: "El nombre del usuario ya existe",
                    value: {
                        statusCode: 400,
                        message: "Datos de actualización incorrectos o campos vacíos",
                        error: "Bad request"
                    },
                    errorFormato: {
                        summary: 'Formato de datos incorrectos',
                        value: {
                            statusCode: 400,
                            message: [
                                'nombre El nombre no es válido',
                                'apellido La apellido no es válido',
                                'email El correo electrónico no es válido',
                                'telefono El telefono no es válido',
                                'password La contraseña no es válida',
                                'role El rol no es válido',
                            ],
                            error: 'Bad request',
                        }
                    }
                },
            }  
        },  
    })
    @Patch(':id')
    @Roles(UserRole.ADMIN)
    async update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Usuario eliminado',
        type: Object,
        content: {
            'application/json': {
                example: {
                    message: 'Usuario eliminado',
                    data: {
                        id: 1,
                        nombre: "Sofia",
                        apellido: "Aponte",
                        email: "apontemurciamateo@gmail.com",
                        telefono: "32000000",
                        password: "12345678",
                        role: "admin"
                    },
                },
            }  
        },
      })
      @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos de eliminación incorrectos o campos vacíos',
        type: Object,
        content: {
            'application/json': {
                example: {
                    coreoDuplicado: "El nombre del usuario ya existe",
                    value: {
                        statusCode: 400,
                        message: "Datos de eliminación incorrectos o campos vacíos",
                        error: "Bad request"
                    },
                    errorFormato: {
                        summary: 'Formato de datos incorrectos',
                        value: {
                            statusCode: 400,
                            message: [
                                'nombre El nombre no es válido',
                                'apellido La apellido no es válido',
                                'email El correo electrónico no es válido',
                                'telefono El telefono no es válido',
                                'password La contraseña no es válida',
                                'role El rol no es válido',
                            ],
                            error: 'Bad request',
                        }
                    }
                },
            }  
        },  
    })
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    async delete(@Param('id') id: number) {
        return this.userService.delete(id);
    }
}
