import { ReduxProvider, ThemeAppProvider, ToastContainer } from '@/components';
import router from '@/routes';
import { CssBaseline } from '@mui/material';
import { Analytics } from '@vercel/analytics/react';
import Joyride from 'react-joyride';
import { RouterProvider } from 'react-router-dom';
import { migrations } from './migration';
import { GUIDE_STEPS } from './utils/constants';

migrations();

function App() {
	return (
		<ReduxProvider>
			<ThemeAppProvider>
				<Joyride steps={GUIDE_STEPS} />
				<CssBaseline />
				<RouterProvider router={router} />
				<ToastContainer />
				<Analytics />
			</ThemeAppProvider>
		</ReduxProvider>
	);
}

export default App;
