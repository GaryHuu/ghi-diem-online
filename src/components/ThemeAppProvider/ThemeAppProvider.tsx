import { createTheme, ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';

const theme = createTheme({
	typography: {
		fontFamily: 'Open Sans, Roboto, Montserrat, sans-serif',
	},
});

type Props = {
	children: ReactNode;
};

function ThemeAppProvider({ children }: Props) {
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default ThemeAppProvider;
