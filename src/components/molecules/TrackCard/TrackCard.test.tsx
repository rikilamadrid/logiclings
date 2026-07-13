import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Track } from '../../../learning/schemas/track'
import { TrackCard } from './TrackCard'

const track: Track = {
  id: 'track-frontend',
  slug: 'frontend',
  title: 'Frontend',
  summary: 'Feel how the browser renders and reacts.',
  order: 0,
  iconKey: 'frontend',
  accentToken: '--color-track-frontend',
}

describe('TrackCard', () => {
  it('links to the track detail route', () => {
    render(
      <MemoryRouter>
        <TrackCard track={track} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /frontend/i })).toHaveAttribute(
      'href',
      '/tracks/frontend',
    )
  })

  it('renders the track title and summary', () => {
    render(
      <MemoryRouter>
        <TrackCard track={track} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Frontend' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Feel how the browser renders and reacts.'),
    ).toBeInTheDocument()
  })
})
