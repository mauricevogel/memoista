import { ProviderIds } from '@src/types/enums'
import { IsEmail, IsEnum, IsNotEmpty, IsUrl } from 'class-validator'

class AccountDto {
  @IsNotEmpty()
  @IsEnum(ProviderIds)
  providerId: string

  @IsNotEmpty()
  providerAccountId: string
}

export class UserWithAccountDto {
  @IsNotEmpty()
  name?: string

  @IsNotEmpty()
  @IsEmail()
  email?: string

  emailVerifiedAt?: Date | null
  passwordDigest?: string
  verificationToken?: string | null

  @IsUrl()
  image?: string

  @IsNotEmpty()
  account: AccountDto
}
