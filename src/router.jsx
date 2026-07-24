import { Navigate } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import DashboardPage from './pages/DashboardPage'
import SpeakPage from './pages/SpeakPage'
import StudioHomePage from './pages/StudioHomePage'
import WritePage from './pages/WritePage'
import { ROUTES } from './constants/routes'

/**
 * Central routing structure for Creator Studio.
 *
 * /              → Dashboard
 * /studio        → Speak / Write choice
 * /studio/speak  → Speak flow
 * /studio/write  → Write flow
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.DASHBOARD,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'studio',
        children: [
          {
            index: true,
            element: <StudioHomePage />,
          },
          {
            path: 'speak',
            element: <SpeakPage />,
          },
          {
            path: 'write',
            element: <WritePage />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
    ],
  },
])
