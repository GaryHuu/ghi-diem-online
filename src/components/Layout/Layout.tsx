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
	SettingsBrightness as SettingsBrightnessIcon,
} from '@mui/icons-material';
import { AppBar, Box, IconButton, Paper, Toolbar } from '@mui/material';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const NEXT_SCHEME: Record<ColorScheme, ColorScheme> = {
	light: 'dark',
	dark: 'system',
	system: 'light',
};

const SCHEME_ICON: Record<ColorScheme, typeof LightModeIcon> = {
	light: LightModeIcon,
	dark: DarkModeIcon,
	system: SettingsBrightnessIcon,
};

function Layout() {
	useScrollToTop();
	const [isOpenSettingDialog, setIsOpenSettingDialog] = useState(false);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const setting = useAppSelector((state: RootState) => state.setting);
	const SchemeIcon = SCHEME_ICON[setting.colorScheme];

	const handleToggleScheme = () => {
		const next = NEXT_SCHEME[setting.colorScheme];
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
				</Toolbar>
			</AppBar>
			<SettingDialog isOpen={isOpenSettingDialog} onClose={() => setIsOpenSettingDialog(false)} />
		</>
	);
}

export default Layout;
