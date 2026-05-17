import SettingDialog from '@/components/SettingDialog';
import { useScrollToTop } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateColorScheme } from '@/redux/slices/settingSlice';
import { RootState } from '@/redux/store';
import { ROUTES } from '@/routes/constants';
import { settingService } from '@/services';
import { ColorScheme } from '@/utils/types';
import {
	DarkMode as DarkModeIcon,
	Home as HomeIcon,
	LightMode as LightModeIcon,
	Settings as SettingsIcon,
} from '@mui/icons-material';
import { AppBar, Box, IconButton, Paper, Stack, Toolbar } from '@mui/material';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const resolveEffective = (current: ColorScheme): 'light' | 'dark' => {
	if (current === 'light' || current === 'dark') return current;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function Layout() {
	useScrollToTop();
	const [isOpenSettingDialog, setIsOpenSettingDialog] = useState(false);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const setting = useAppSelector((state: RootState) => state.setting);
	const effectiveScheme = resolveEffective(setting.colorScheme);
	const SchemeIcon = effectiveScheme === 'dark' ? DarkModeIcon : LightModeIcon;

	const handleToggleScheme = () => {
		const next: ColorScheme = effectiveScheme === 'dark' ? 'light' : 'dark';
		dispatch(updateColorScheme(next));
		settingService.update({ ...setting, colorScheme: next });
	};

	return (
		<>
			<Paper sx={{ pb: '64px', minHeight: '100vh', display: 'flex' }}>
				<Box sx={{ flex: 1, overflowY: 'auto' }}>
					<Outlet />
				</Box>
			</Paper>
			<AppBar
				position="fixed"
				color="default"
				elevation={0}
				sx={{
					top: 'auto',
					bottom: 0,
					backgroundColor: 'background.paper',
					borderTop: (theme) => `1px solid ${theme.palette.divider}`,
				}}
			>
				<Toolbar sx={{ minHeight: '64px !important' }}>
					<Stack direction="row" justifyContent="space-around" sx={{ width: '100%' }}>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={() => navigate(ROUTES.HOME)}
						>
							<HomeIcon />
						</IconButton>
						<IconButton
							color="inherit"
							aria-label={`color scheme: ${setting.colorScheme}`}
							onClick={handleToggleScheme}
						>
							<SchemeIcon />
						</IconButton>
						<IconButton color="inherit" onClick={() => setIsOpenSettingDialog(true)}>
							<SettingsIcon />
						</IconButton>
					</Stack>
				</Toolbar>
			</AppBar>
			<SettingDialog isOpen={isOpenSettingDialog} onClose={() => setIsOpenSettingDialog(false)} />
		</>
	);
}

export default Layout;
