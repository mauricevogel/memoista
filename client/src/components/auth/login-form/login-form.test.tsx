import userEvent from '@testing-library/user-event'
import { render, screen } from '@tests/utils'

import { LoginForm } from './login-form'

jest.mock('@/actions/login-user', () => {
  return {
    loginUser: jest.fn()
  }
})

describe('RegisterForm', () => {
  let emailField: HTMLInputElement
  let passwordField: HTMLInputElement

  const setup = () => {
    render(<LoginForm />)

    emailField = screen.getByLabelText('Email *')
    passwordField = screen.getByLabelText('Password *')
  }

  it('should accept user input', async () => {
    setup()
    const user = userEvent.setup()

    await user.type(emailField, 'test@example.com')
    expect(emailField).toHaveValue('test@example.com')

    await user.type(passwordField, 'password')
    expect(passwordField).toHaveValue('password')
  })

  it('should display validation errors on email field', async () => {
    setup()
    const user = userEvent.setup()

    await user.type(emailField, 'test')
    await user.tab()
    expect(screen.getByText('Needs to be a valid email address')).toBeInTheDocument()

    await user.clear(emailField)
    await user.tab()
    expect(screen.getByText('Needs to be a valid email address')).toBeInTheDocument()
  })

  it('should display validation errors on password field', async () => {
    setup()
    const user = userEvent.setup()

    await user.clear(passwordField)
    await user.tab()
    expect(screen.getByText('Is required')).toBeInTheDocument()
  })
})
