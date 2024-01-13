import Layout from '@/components/Layout'
import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import { ROUTES } from './constants'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },

      {
        path: ROUTES.CREATE_NEW_GAME,
        element: <div>New Game</div>,
      },
      {
        path: '/bar',
        element: <div>foo</div>,
      },
    ],
  },
])

export default router
