import { Metadata } from 'next'

import { RegisterForm } from '@/components/auth/register-form/register-form'

export const metadata: Metadata = {
  title: 'Memoista | Register today'
}

export default function RegisterPage() {
  return <RegisterForm />
}
