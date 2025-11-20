import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { create } from 'domain';
import { error } from 'console';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: RegisterDto,
    description: 'Registro de usuario',
    required: true,
    examples: {
      exitoso: {
        summary: 'Registro exitoso',
        value: {
          cli_nombre: "Sofia",
          cli_apellido: "Aponte",
          cli_email: "apontemurciamateo@gmail.com",
          cli_telefono: "32000000",
          cli_password: "12345678"
        },
    }, errorValidation: {
        summary: 'Ejemplo de error (correo duplicado)',
        value: {
          cli_nombre: "Sofia",
          cli_apellido: "Aponte",
          cli_email: "apontemurciamateo@gmail.com",
          cli_telefono: "32000000",
          cli_password: "12345678"
        },
      },      
   }
})
  @ApiResponse({
    status: 200,
    description: 'Usuario registrado',
    type: Object,
    content: {
      'application/json': {
        example: {
          message: 'Usuario registrado. Verifica tu correo.',
          data: {
            cli_id: 1,
            cli_nombre: "Sofia",
            cli_apellido: "Aponte",
            cli_email: "apontemurciamateo@gmail.com",
            cli_telefono: "32000000",
            createdAt: "2021-03-01T00:00:00.000Z",
          }
        }
      }
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de registro incorrectos o correo duplicado',
    type: Object,
    content: {
      'application/json': {
        example: {
          coreoDuplicado: "El correo electrónico ya existe",
          value: {
            statusCode: 400,
            message: "Datos de registro incorrectos o correo duplicado",
            error: "Bad request"
          },
          errorFormato: {
            summary: 'Formato de datos incorrectos',
            value: {
              statusCode: 400,
              message: [
                'cli_correo El correo electrónico no es válido',
                'cli_password La contraseña debe tener al menos 6 caracteres',
              ],
              error: 'Bad request',
          }
        },
      }  
    },
    },
  })

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Correo de verificación enviado',
    type: Object,
    content: {
      'application/json': {
        example: {
          message: 'Correo de verificación enviado a apontemurciamateo@gmail.com',
          data: {
            message: 'Correo de verificación enviado a apontemurciamateo@gmail.com',
          },
        },
      }
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de registro incorrectos o correo duplicado',
    type: Object,
    content: {
      'application/json': {
        example: {
          errorFormato: {
            summary: 'Formato de datos incorrectos',
            value: {
              statusCode: 400,
              message: [
                'cli_correo El correo electrónico no es válido',
                'cli_password La contraseña debe tener al menos 6 caracteres',
              ],
              error: 'Bad request',
          } 
        },
      }  
    },
  }
  })

  @Get('verify')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @ApiResponse({
    status: 200,
    description: 'Correo de verificación enviado',
    type: Object,
    content: {
      'application/json': {
        example: {
          message: 'Correo de verificación enviado a apontemurciamateo@gmail.com',
          data: {
            message: 'Correo de verificación enviado a apontemurciamateo@gmail.com',
          },
        },
      }  
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de registro incorrectos o correo duplicado',
    type: Object,
    content: {
      'application/json': {
        example: {
          errorFormato: {
            summary: 'Formato de datos incorrectos',
            value: {
              statusCode: 400,
              message: [
                'cli_correo El correo electrónico no es válido',
                'cli_password La contraseña debe tener al menos 6 caracteres',
              ],
              error: 'Bad request',
          } 
        },
      }  
    },
    }
  })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @ApiResponse({
    status: 200,
    description: 'Correo de verificación enviado a la dirección de correo proporcionada',
    type: Object,
    content: {
      'application/json': {
        example: {
          message: 'Correo de verificación enviado a apontemurciamateo@gmail.com',
          data: {
            message: 'Correo de verificación enviado a apontemurciamateo@gmail.com',
          },
        },
      }
    },
  })
  @ApiResponse({
    status: 400,
    description: 'No se ha podido enviar el correo de verificación',
    type: Object,
    content: {
      'application/json': {
        example: {
          errorFormato: {
            summary: 'No se ha podido enviar el correo de verificación',
            value: {
              statusCode: 400,
              message: [
                'No se ha podido enviar el correo de verificación',
                'Verifica la dirección de correo proporcionada',
              ],
              error: 'Bad request',
          } 
        },
      }  
    },
  }
})
  @Post('request-reset')
  requestReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }
  @ApiResponse({
    status: 200,
    description: 'Link de restablecimiento de contraseña enviado',
    type: Object,
    content: {
      'application/json': {
        example: {
          message: 'Link de restablecimiento de contraseña enviado',
          data: {
            message: 'Verifica tu correo para restablecer tu contraseña',
          },
        },
      }  
    },
  })
  @ApiResponse({
    status: 400,
    description: 'No se ha podido enviar el link de restablecimiento de contraseña',
    type: Object,
    content: {
      'application/json': {
        example: {
          errorFormato: {
            summary: 'Problema al enviar el link de restablecimiento de contraseña',
            value: {
              statusCode: 400,
              message: [
                'No se ha podido enviar el link de restablecimiento de contraseña',
                'Error al intentar enviar el correo',
              ],
              error: 'Bad request',
          } 
        },
      }  
    },
    }
  })
  @Get('reset-password')
    showResetPasswordPage(@Query('token') token: string) {
      
        return { 
            status: "OK", 
            message: "Ruta temporal de prueba para restablecimiento recibida.",
            instruccion: "Ahora, debe probar la ruta POST en tu cliente HTTP (Postman/ThunderClient) para ejecutar el cambio de contraseña.",
            token_recibido: token 
        };
    }
     @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida correctamente',
    type: Object,
    content: {
      'application/json': {
        example: {
          message: 'La contraseña ha sido restablecida correctamente',
          data: {
            message: 'Contraseña restablecida correctamente',
          },
        },
      }  
    },
  })
  @ApiResponse({
    status: 400,
    description: 'No se ha podido restablecer la contraseña',
    type: Object,
    content: {
      'application/json': {
        example: {
          errorFormato: {
            summary: 'Problema al restablecer la contraseña',
            value: {
              statusCode: 400,
              message: [
                'No se ha podido restablecer la contraseña',
                'Error al intentar restablecer la contraseña',
              ],
              error: 'Bad request',
          } 
        },
      }  
    },
    }
  })
    @Post('reset-password')
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    }
}
