import { ROUTES } from '@/routes/constants'
import HomeIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import { Outlet, useNavigate } from 'react-router-dom'
import SettingDialog from './SettingDialog'
import { useState } from 'react'

function Layout() {
  const [isOpenSettingDialog, setIsOpenSettingDialog] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <Paper sx={{ pb: '64px', minHeight: '100vh', display: 'flex' }}>
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </Box>
      </Paper>
      <AppBar position='fixed' color='primary' sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={() => navigate(ROUTES.HOME)}
          >
            <HomeIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color='inherit'
            onClick={() => setIsOpenSettingDialog(true)}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <SettingDialog
        isOpen={isOpenSettingDialog}
        onClose={() => setIsOpenSettingDialog(false)}
      />
    </>
  )
}

export default Layout
