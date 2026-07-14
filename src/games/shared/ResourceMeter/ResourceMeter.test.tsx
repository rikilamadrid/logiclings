import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResourceMeter } from './ResourceMeter'
import { resourceMeterStatus } from './resourceMeterStatus'

describe('resourceMeterStatus', () => {
  it('reports calm below the busy threshold', () => {
    expect(resourceMeterStatus(20, 100)).toBe('calm')
  })

  it('reports busy between the busy and strained thresholds', () => {
    expect(resourceMeterStatus(50, 100)).toBe('busy')
  })

  it('reports strained at or above the strained threshold', () => {
    expect(resourceMeterStatus(75, 100)).toBe('strained')
  })
})

describe('ResourceMeter', () => {
  it('exposes the value and status as text and ARIA attributes, not color alone', () => {
    render(<ResourceMeter label="Origin server strain" value={90} />)

    const meter = screen.getByRole('meter', { name: 'Origin server strain' })
    expect(meter).toHaveAttribute('aria-valuenow', '90')
    expect(meter).toHaveAttribute('data-status', 'strained')
    expect(screen.getByText('90 / 100 · Strained')).toBeInTheDocument()
  })

  it('clamps out-of-range values into the displayed range', () => {
    render(<ResourceMeter label="Origin server strain" value={150} />)
    expect(screen.getByText('100 / 100 · Strained')).toBeInTheDocument()
  })
})
