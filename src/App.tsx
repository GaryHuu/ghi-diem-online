import { ReduxProvider, ThemeAppProvider, ToastContainer } from '@/components';
import router from '@/routes';
import { CssBaseline } from '@mui/material';
import { Analytics } from '@vercel/analytics/react';
import { RouterProvider } from 'react-router-dom';
import { migrations } from './migration';

migrations();

function App() {
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
