import { Outlet } from 'react-router-dom'
import { ErrorBoundary } from '../../../app/ErrorBoundary'
import { NavBar } from '../../organisms/NavBar/NavBar'
import styles from './AppShell.module.css'

export function AppShell() {
  return (
    <div className={styles.shell}>
      <NavBar />
      <main className={styles.main}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}
