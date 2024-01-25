import { User } from '@prisma/client'
import prisma from '@src/prisma'

export class UserService {
  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id
      }
    })
  }
}
