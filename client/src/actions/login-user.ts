'use server'

import { AuthError } from 'next-auth'
import * as z from 'zod'

import { signIn } from '@/auth'
import { LoginUserSchema } from '@/schemas'

export const loginUser = async (values: z.infer<typeof LoginUserSchema>) => {
  const validatedFields = LoginUserSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  try {
    await signIn('credentials', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirectTo: '/'
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' }
        default:
          return { error: 'Error logging in' }
      }
    }

    throw error
  }
}
