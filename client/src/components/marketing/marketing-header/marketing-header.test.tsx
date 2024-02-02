import '@testing-library/jest-dom'

import { render, screen } from '@tests/utils'

import { MarketingHeader } from './marketing-header'

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
})
