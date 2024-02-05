import userEvent from '@testing-library/user-event'
import { render, screen } from '@tests/utils'

import { RegisterForm } from './register-form'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

describe('RegisterForm', () => {
  let usernameField: HTMLInputElement
  let emailField: HTMLInputElement
  let passwordField: HTMLInputElement
  let passwordConfirmationField: HTMLInputElement

  const setup = () => {
    render(<RegisterForm />)

    usernameField = screen.getByLabelText('Username *')
    emailField = screen.getByLabelText('Email *')
    passwordField = screen.getByLabelText('Password *')
    passwordConfirmationField = screen.getByLabelText('Password confirmation *')
  }

  it('should accept user input', async () => {
    setup()
    const user = userEvent.setup()

    await user.type(usernameField, 'test')
    expect(usernameField).toHaveValue('test')

    await user.type(emailField, 'test@example.com')
    expect(emailField).toHaveValue('test@example.com')

    await user.type(passwordField, 'password')
    expect(passwordField).toHaveValue('password')

    await user.type(passwordConfirmationField, 'password')
    expect(passwordConfirmationField).toHaveValue('password')
  })

  it('should display validation errors on username field', async () => {
    setup()
    const user = userEvent.setup()

    await user.type(usernameField, 't')
    await user.tab()
    expect(screen.getByText('Minimum 3 characters required')).toBeInTheDocument()

    await user.clear(usernameField)
    await user.tab()
    expect(screen.getByText('Minimum 3 characters required')).toBeInTheDocument()
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

    await user.type(passwordField, 'test')
    await user.tab()
    expect(screen.getByText('Minimum 6 characters required')).toBeInTheDocument()

    await user.clear(passwordField)
    await user.tab()
    expect(screen.getByText('Minimum 6 characters required')).toBeInTheDocument()
  })

  it('should display validation errors on password confirmation field', async () => {
    setup()
    const user = userEvent.setup()

    await user.type(passwordConfirmationField, 'test')
    await user.tab()
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()

    await user.clear(passwordConfirmationField)
    await user.tab()
    expect(screen.getByText('Minimum 6 characters required')).toBeInTheDocument()

    await user.type(passwordField, 'test-password')
    await user.type(passwordConfirmationField, 'other-password')
    await user.tab()
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
  })
})
