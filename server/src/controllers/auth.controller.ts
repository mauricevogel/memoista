import { User } from '@prisma/client'
import { RegisterUserDto } from '@src/dtos/auth/register-user.dto'
import { SigninUserDto } from '@src/dtos/auth/signin-user.dto'
import { TokenResponseDto } from '@src/dtos/auth/token-response.dto'
import { UserDto } from '@src/dtos/user.dto'
import { Serialize } from '@src/interceptors/serialize.interceptor'
import { AuthService } from '@src/services/auth.service'
import { Body, CurrentUser, Get, HttpCode, JsonController, Post } from 'routing-controllers'
import Container from 'typedi'

@JsonController('/auth')
export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = Container.get(AuthService)
  }

  @Get('/whoami')
  @Serialize(UserDto)
  async whoAmI(@CurrentUser({ required: true }) user: User): Promise<User> {
    return user
  }

  @Post('/signin')
  async signInWithCredentials(@Body() signInDto: SigninUserDto): Promise<TokenResponseDto> {
    return this.authService.signInWithCredentials(signInDto)
  }

  @Post('/register')
  @HttpCode(201)
  @Serialize(UserDto)
  async registerUserWithCredentials(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.authService.registerUserWithCredentials(registerUserDto)
  }

  @Post('/verify')
  @HttpCode(200)
  @Serialize(UserDto)
  async verifyUser(@Body() { verificationToken }: { verificationToken: string }): Promise<User> {
    return await this.authService.verifyUser(verificationToken)
  }

  @Post('/refresh-tokens')
  async refreshTokens(
    @Body() { refreshToken }: { refreshToken: string }
  ): Promise<TokenResponseDto> {
    return this.authService.refreshAccessTokens(refreshToken)
  }
}
