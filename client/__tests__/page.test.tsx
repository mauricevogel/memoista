import '@testing-library/jest-dom'

import Page from '@/app/(marketing)/page'

import { render, screen } from './utils'

describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />)

    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toBeInTheDocument()
  })
})
