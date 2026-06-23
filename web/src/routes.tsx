import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from './pages/home-page'
import { NotFoundPage } from './pages/not-found-page'
import { RedirectPage } from './pages/redirect-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/:shortUrl',
    element: <RedirectPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
