import { Metadata } from 'next'

import { LoginForm } from '@/components/auth/login-form/login-form'

export const metadata: Metadata = {
  title: 'Memoista | Login'
}

export default function RegisterPage() {
  return <LoginForm />
}
