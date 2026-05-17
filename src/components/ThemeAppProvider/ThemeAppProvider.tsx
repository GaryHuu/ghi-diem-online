import {
	experimental_extendTheme as extendTheme,
	Experimental_CssVarsProvider as CssVarsProvider,
	useColorScheme,
} from '@mui/material/styles';
import { ReactNode, useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { settingService } from '@/services';

const theme = extendTheme({
	colorSchemes: {
		light: {
			palette: {
				primary: { main: '#1976D2' },
			},
		},
		dark: {
			palette: {
				primary: { main: '#90caf9' },
				background: {
					default: '#121212',
					paper: '#1e1e1e',
				},
			},
		},
	},
	typography: {
		fontFamily: 'Open Sans, Roboto, Montserrat, sans-serif',
	},
});

const initialColorScheme = settingService.get().colorScheme;

function ColorSchemeSync() {
	const { setMode } = useColorScheme();
	const colorScheme = useAppSelector((state: RootState) => state.setting.colorScheme);

	useEffect(() => {
		setMode(colorScheme);
	}, [colorScheme, setMode]);

	return null;
}

type Props = {
	children: ReactNode;
};

function ThemeAppProvider({ children }: Props) {
	return (
		<CssVarsProvider
			theme={theme}
			defaultMode={initialColorScheme}
			modeStorageKey="ghidiem-color-mode"
		>
			<ColorSchemeSync />
			{children}
		</CssVarsProvider>
	);
}

export default ThemeAppProvider;
