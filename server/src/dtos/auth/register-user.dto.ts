import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator'

export class RegisterUserDto {
  @Length(3, 20)
  @IsNotEmpty()
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @MinLength(8)
  @IsNotEmpty()
  password: string

  @MinLength(8)
  @IsNotEmpty()
  passwordConfirmation: string
}
