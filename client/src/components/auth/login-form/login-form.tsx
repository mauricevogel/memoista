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
import { useState, useTransition } from 'react'
import * as z from 'zod'

import { loginUser } from '@/actions/login-user'
import { FormError } from '@/components/ui/form-error/form-error'
import { LoginUserSchema } from '@/schemas'

import classes from './login-form.module.css'

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: zodResolver(LoginUserSchema),
    validateInputOnBlur: true
  })

  const handleSubmit = (values: z.infer<typeof LoginUserSchema>) => {
    setError('')

    startTransition(() => {
      loginUser(values).then((response) => {
        if (response?.error) {
          form.reset()
          setError(response.error)
        }
      })
    })
  }

  return (
    <Container my={40} className={classes.loginContainer}>
      <Image src="/logo.svg" alt="Mantine logo" width={175} height={100} priority />
      <Title className={classes.title}>Login</Title>
      <Text c="dimmed" size="sm" mt={5}>
        Have no account yet?{' '}
        <Link href="/auth/register" style={{ display: 'contents' }}>
          <Anchor size="sm" component="button" underline="never">
            Register
          </Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" className={classes.formContainer}>
        <LoadingOverlay visible={isPending} />
        <FormError message={error} />

        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            name="email"
            label="Email"
            placeholder="you@mantine.dev"
            withAsterisk
            {...form.getInputProps('email')}
          />
          <PasswordInput
            name="password"
            label="Password"
            placeholder="Your password"
            mt="md"
            withAsterisk
            {...form.getInputProps('password')}
          />
          <Button type="submit" fullWidth mt="xl">
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
