import * as z from 'zod'

export const LoginUserSchema = z.object({
  email: z.string().email({
    message: 'Needs to be a valid email address'
  }),
  password: z.string().min(1, {
    message: 'Is required'
  })
})

export const RegisterUserSchema = z
  .object({
    name: z.string().min(3, {
      message: 'Minimum 3 characters required'
    }),
    email: z.string().email({
      message: 'Needs to be a valid email address'
    }),
    password: z.string().min(6, {
      message: 'Minimum 6 characters required'
    }),
    passwordConfirmation: z.string().min(6, {
      message: 'Minimum 6 characters required'
    })
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation']
  })
