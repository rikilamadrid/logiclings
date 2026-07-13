import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { NavBar } from './NavBar'

describe('NavBar', () => {
  it('renders a link to every primary route', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
      'href',
      '/',
    )
    expect(screen.getByRole('link', { name: /tracks/i })).toHaveAttribute(
      'href',
      '/tracks',
    )
    expect(screen.getByRole('link', { name: /profile/i })).toHaveAttribute(
      'href',
      '/profile',
    )
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute(
      'href',
      '/settings',
    )
  })

  it('marks the current route as the active page', () => {
    render(
      <MemoryRouter initialEntries={['/tracks']}>
        <NavBar />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /tracks/i })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('exposes a labeled primary navigation landmark', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('navigation', { name: 'Primary' }),
    ).toBeInTheDocument()
  })
})
