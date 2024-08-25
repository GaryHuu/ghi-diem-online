import { ReduxProvider, ToastContainer } from '@/components';
import AppProvider from '@/components/AppProvider';
import router from '@/routes';
import { CssBaseline } from '@mui/material';
import { Analytics } from '@vercel/analytics/react';
import { RouterProvider } from 'react-router-dom';

function App() {
	return (
		<ReduxProvider>
			<CssBaseline />
			<AppProvider>
				<RouterProvider router={router} />
			</AppProvider>
			<ToastContainer />
			<Analytics />
		</ReduxProvider>
	);
}

export default App;
