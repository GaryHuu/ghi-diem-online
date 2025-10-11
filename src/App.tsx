import { ReduxProvider, ThemeAppProvider, ToastContainer } from '@/components';
import router from '@/routes';
import { CssBaseline } from '@mui/material';
import { Analytics } from '@vercel/analytics/react';
import { RouterProvider } from 'react-router-dom';
import { migrations } from './migration';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

migrations();

function App() {
	const { t, i18n } = useTranslation();

	useEffect(() => {
		// Update document title when language changes
		document.title = t('app.title');
	}, [t, i18n.language]);

	return (
		<ReduxProvider>
			<ThemeAppProvider>
				<CssBaseline />
				<RouterProvider router={router} />
				<ToastContainer />
				<Analytics />
			</ThemeAppProvider>
		</ReduxProvider>
	);
}

export default App;
