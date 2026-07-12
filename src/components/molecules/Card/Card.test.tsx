import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card } from './Card'

describe('Card', () => {
  it('renders its children', () => {
    render(
      <Card>
        <p>Event Bubbling</p>
      </Card>,
    )

    expect(screen.getByText('Event Bubbling')).toBeInTheDocument()
  })
})
