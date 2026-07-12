import { NavLink, Outlet } from 'react-router-dom'
import styles from './AppShell.module.css'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/tracks', label: 'Tracks' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
]

export function AppShell() {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <nav className={styles.nav} aria-label="Primary">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={styles.navLink} end>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
