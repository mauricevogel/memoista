import '@testing-library/jest-dom'

import { render, screen } from '../../../../__tests__/utils'
import { DarkModeToggle } from './dark-mode-toggle'

describe('MarketingHeader', () => {
  it('renders correctly', () => {
    render(<DarkModeToggle />)

    expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument()
  })
})
