import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Text } from './Text'

describe('Text', () => {
  it('renders children as a paragraph by default', () => {
    render(<Text>Streak: 6 days</Text>)

    const node = screen.getByText('Streak: 6 days')
    expect(node.tagName).toBe('P')
  })

  it('renders as the given element', () => {
    render(<Text as="span">Level 2 of 4</Text>)

    expect(screen.getByText('Level 2 of 4').tagName).toBe('SPAN')
  })
})
