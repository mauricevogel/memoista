import '@testing-library/jest-dom'

import { render, screen } from '@tests/utils'

import { MarketingMobileNavigation } from './marketing-mobile-navigation'

describe('MarketingMobileNavigation', () => {
  it('renders correctly', () => {
    const links = [
      { title: 'Home', href: '/' },
      { title: 'Features', href: '/features' },
      { title: 'About', href: '/about' }
    ]

    render(<MarketingMobileNavigation isOpen={true} onClose={() => {}} links={links} />)

    links.forEach((link) => {
      expect(screen.getByRole('link', { name: link.title })).toHaveAttribute('href', link.href)
    })
  })
})
