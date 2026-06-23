import { createBrowserRouter } from 'react-router-dom'
import { Placeholder } from './pages/placeholder'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Placeholder />,
  },
])
