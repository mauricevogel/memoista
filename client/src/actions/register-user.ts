'use server'

import * as z from 'zod'

import { RegisterUserSchema } from '@/schemas'

export const registerUser = async (values: z.infer<typeof RegisterUserSchema>) => {
  try {
    const validatedFields = RegisterUserSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const registerResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFields.data)
    })

    if (!registerResponse.ok) {
      const errorBody = await registerResponse.json()
      return { error: errorBody.message }
    }

    return { success: 'Signed up successfully' }
  } catch {
    return { error: 'Error registering' }
  }
}
