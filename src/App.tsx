import { ReduxProvider, ThemeAppProvider, ToastContainer } from '@/components';
import router from '@/routes';
import { CssBaseline } from '@mui/material';
import { Analytics } from '@vercel/analytics/react';

import Guideline from '@/components/Guideline';
import { RouterProvider } from 'react-router-dom';
import { GuideType, HOME_GUIDE_STEPS } from './components/Guideline/constants';
import { migrations } from './migration';

migrations();

function App() {
	return (
		<ReduxProvider>
			<ThemeAppProvider>
				<Guideline steps={HOME_GUIDE_STEPS} type={GuideType.HOME} />
				<CssBaseline />
				<RouterProvider router={router} />
				<ToastContainer />
				<Analytics />
			</ThemeAppProvider>
		</ReduxProvider>
	);
}

export default App;
