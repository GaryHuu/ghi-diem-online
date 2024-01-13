import HomeIcon from '@mui/icons-material/Home'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
      <Outlet />
      <AppBar position='fixed' color='secondary' sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <IconButton color='inherit' aria-label='open drawer'>
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Layout
