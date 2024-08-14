import AppProvider from '@/components/AppProvider';
import router from '@/routes';
import { CssBaseline } from '@mui/material';
import { Analytics } from '@vercel/analytics/react';
import { RouterProvider } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from '@/components';

function App() {
	return (
		<AppProvider>
			<CssBaseline />
			<RouterProvider router={router} />
			<ToastContainer />
			<Analytics />
		</AppProvider>
	);
}

export default App;
