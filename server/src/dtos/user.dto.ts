import { Expose } from 'class-transformer'

export class UserDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  image: string | null

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date
}
