import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its content', () => {
    render(<Badge tone="success">Mastered</Badge>)

    expect(screen.getByText('Mastered')).toBeInTheDocument()
  })

  it('renders a track accent tone', () => {
    render(<Badge tone="frontend">Frontend</Badge>)

    expect(screen.getByText('Frontend')).toBeInTheDocument()
  })
})
