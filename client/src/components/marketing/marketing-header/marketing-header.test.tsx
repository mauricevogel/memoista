import '@testing-library/jest-dom'

import { render, screen } from '@tests/utils'

import { MarketingHeader } from './marketing-header'

let mockUseMemoistaSessionStatus = 'unauthenticated'
jest.mock('../../../hooks/use-memoista-session', () => {
  return jest.fn(() => ({
    status: mockUseMemoistaSessionStatus
  }))
})

describe('MarketingHeader', () => {
  it('renders correctly', () => {
    const links = [
      { title: 'Home', href: '/' },
      { title: 'Features', href: '/features' },
      { title: 'About', href: '/about' }
    ]

    render(<MarketingHeader />)

    links.forEach((link) => {
      expect(screen.getByRole('link', { name: link.title })).toHaveAttribute('href', link.href)
    })
  })

  it('renders the correct action buttons when the user is authenticated', () => {
    mockUseMemoistaSessionStatus = 'authenticated'
    render(<MarketingHeader />)

    expect(screen.getByRole('button', { name: 'Go to app' })).toBeInTheDocument()
  })

  it('renders the correct action buttons when the user is not authenticated', () => {
    mockUseMemoistaSessionStatus = 'unauthenticated'
    render(<MarketingHeader />)

    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
  })
})
