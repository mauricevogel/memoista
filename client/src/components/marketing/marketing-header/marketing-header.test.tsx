import '@testing-library/jest-dom'

import { render, screen } from '@tests/utils'

import { MarketingHeader } from './marketing-header'

describe('MarketingHeader', () => {
  it('renders correctly', () => {
    render(<MarketingHeader />)

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '/features')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/auth/login')
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/auth/register')
  })
})
