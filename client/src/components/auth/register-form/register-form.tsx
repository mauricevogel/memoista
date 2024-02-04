'use client'

import {
  Anchor,
  Button,
  Container,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import * as z from 'zod'

import { registerUser } from '@/actions/register-user'
import { FormError } from '@/components/ui/form-error/form-error'
import { RegisterUserSchema } from '@/schemas'

import classes from './register-form.module.css'

export const RegisterForm = () => {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    },
    validate: zodResolver(RegisterUserSchema),
    validateInputOnBlur: true
  })

  const handleSubmit = (values: z.infer<typeof RegisterUserSchema>) => {
    setError('')

    startTransition(() => {
      registerUser(values).then((response) => {
        if (response.success) {
          router.push('/')
        } else {
          setError(response.error)
        }
      })
    })
  }

  return (
    <Container my={40} className={classes.registerContainer}>
      <Image src="/logo.svg" alt="Mantine logo" width={175} height={100} priority />
      <Title className={classes.title}>Register today</Title>
      <Text c="dimmed" size="sm" mt={5}>
        Already have an account?{' '}
        <Link href="/auth/login" style={{ display: 'contents' }}>
          <Anchor size="sm" component="button" underline="never">
            Login
          </Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" className={classes.formContainer}>
        <LoadingOverlay visible={isPending} />
        <FormError message={error} />

        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            label="Username"
            placeholder="Select username"
            withAsterisk
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            mt="md"
            withAsterisk
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            withAsterisk
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label="Password confirmation"
            placeholder="Confirm your password"
            mt="md"
            withAsterisk
            {...form.getInputProps('passwordConfirmation')}
          />
          <Button type="submit" fullWidth mt="xl">
            Register now
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
