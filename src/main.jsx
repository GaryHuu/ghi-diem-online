import router from '@/routes'
import { CssBaseline } from '@mui/material'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <CssBaseline />
    <RouterProvider router={router} />
  </>
)
