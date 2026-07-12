import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../../components/templates/AppShell'
import { HomePage } from '../routes/HomePage'
import { TracksPage } from '../routes/TracksPage'
import { TrackDetailPage } from '../routes/TrackDetailPage'
import { PlayLessonPage } from '../routes/PlayLessonPage'
import { PlayResultPage } from '../routes/PlayResultPage'
import { ProfilePage } from '../routes/ProfilePage'
import { SettingsPage } from '../routes/SettingsPage'
import { SignInPage } from '../routes/SignInPage'
import { SignUpPage } from '../routes/SignUpPage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/tracks', element: <TracksPage /> },
      { path: '/tracks/:trackSlug', element: <TrackDetailPage /> },
      { path: '/play/:lessonSlug', element: <PlayLessonPage /> },
      { path: '/play/:lessonSlug/result', element: <PlayResultPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/auth/sign-in', element: <SignInPage /> },
      { path: '/auth/sign-up', element: <SignUpPage /> },
    ],
  },
])
