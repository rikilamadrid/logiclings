import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { HomeIcon, ProfileIcon, SettingsIcon, TracksIcon } from './navIcons'
import styles from './NavBar.module.css'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
}

const navItems: NavItem[] = [
  { to: '/', label: 'Home', icon: <HomeIcon /> },
  { to: '/tracks', label: 'Tracks', icon: <TracksIcon /> },
  { to: '/profile', label: 'Profile', icon: <ProfileIcon /> },
  { to: '/settings', label: 'Settings', icon: <SettingsIcon /> },
]

export function NavBar() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <ul className={styles.list}>
        {navItems.map((item) => (
          <li key={item.to} className={styles.item}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [styles.link, isActive ? styles.linkActive : '']
                  .filter(Boolean)
                  .join(' ')
              }
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
