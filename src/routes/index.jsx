import Layout from '@/components/Layout'
import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },

      {
        path: '/foo',
        element: <div>foo</div>,
      },
      {
        path: '/bar',
        element: <div>foo</div>,
      },
    ],
  },
])

export default router
