import router from '@/routes'
import { CssBaseline } from '@mui/material'
import { RouterProvider } from 'react-router-dom'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ScrollToTopOnPathChange from '@/components/ScrollToTopOnPathChange'

function App() {
  return (
    <>
      <CssBaseline />
      <RouterProvider router={router}>
        <ScrollToTopOnPathChange />
      </RouterProvider>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  )
}

export default App
