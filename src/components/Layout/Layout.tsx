import SettingDialog from '@/components/SettingDialog';
import { useScrollToTop } from '@/hooks';
import { ROUTES } from '@/routes/constants';
import { Home as HomeIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { AppBar, Box, IconButton, Paper, Toolbar } from '@mui/material';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function Layout() {
	useScrollToTop();
	const [isOpenSettingDialog, setIsOpenSettingDialog] = useState(false);
	const navigate = useNavigate();

	return (
		<>
			<Paper sx={{ pb: '64px', minHeight: '100vh', display: 'flex' }}>
				<Box sx={{ flex: 1, overflowY: 'auto' }}>
					<Outlet />
				</Box>
			</Paper>
			<AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={() => navigate(ROUTES.HOME)}
					>
						<HomeIcon />
					</IconButton>
					<Box sx={{ flexGrow: 1 }} />
					<IconButton color="inherit" onClick={() => setIsOpenSettingDialog(true)}>
						<SettingsIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<SettingDialog isOpen={isOpenSettingDialog} onClose={() => setIsOpenSettingDialog(false)} />
		</>
	);
}

export default Layout;
