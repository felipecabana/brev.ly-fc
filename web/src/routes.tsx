import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Spinner } from './components/ui/spinner'

const HomePage = lazy(() =>
  import('./pages/home-page').then((module) => ({ default: module.HomePage })),
)
const RedirectPage = lazy(() =>
  import('./pages/redirect-page').then((module) => ({
    default: module.RedirectPage,
  })),
)
const NotFoundPage = lazy(() =>
  import('./pages/not-found-page').then((module) => ({
    default: module.NotFoundPage,
  })),
)

function withSuspense(element: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-200">
          <Spinner label="Carregando página" />
        </div>
      }
    >
      {element}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(<HomePage />),
  },
  {
    path: '/:shortUrl',
    element: withSuspense(<RedirectPage />),
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />),
  },
])
