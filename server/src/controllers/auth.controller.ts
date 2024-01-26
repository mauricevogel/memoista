import { User } from '@prisma/client'
import { RegisterUserDto } from '@src/dtos/auth/register-user.dto'
import { UserDto } from '@src/dtos/user.dto'
import { Serialize } from '@src/interceptors/serialize.interceptor'
import { AuthService } from '@src/services/auth.service'
import { Body, HttpCode, JsonController, Post } from 'routing-controllers'
import Container from 'typedi'

@JsonController('/auth')
export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = Container.get(AuthService)
  }

  @Post('/register')
  @HttpCode(201)
  @Serialize(UserDto)
  async registerUserWithCredentials(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.authService.registerUserWithCredentials(registerUserDto)
  }
}
