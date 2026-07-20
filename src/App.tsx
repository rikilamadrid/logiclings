import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './app/providers/AppProviders'
import { router } from './app/router/router'
import { useServiceWorkerUpdate } from './app/pwa/useServiceWorkerUpdate'
import { UpdatePrompt } from './components/organisms/UpdatePrompt/UpdatePrompt'

function App() {
  const { needsRefresh, applyUpdate, dismiss } = useServiceWorkerUpdate()

  return (
    <AppProviders>
      <RouterProvider router={router} />
      {needsRefresh && (
        <UpdatePrompt onRefresh={applyUpdate} onDismiss={dismiss} />
      )}
    </AppProviders>
  )
}

export default App
