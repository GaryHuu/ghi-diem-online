import { Layout } from '@/components';
import { CreatingPage, DashboardPage, HomePage, PlayingPage, SharedViewPage } from '@/pages';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './constants';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: ROUTES.HOME,
				element: <HomePage />,
			},
			{
				path: ROUTES.CREATE_NEW_MATCH,
				element: <CreatingPage />,
			},
			{
				path: ROUTES.MATCH,
				element: <PlayingPage />,
			},
			{
				path: ROUTES.SHARE,
				element: <SharedViewPage />,
			},
			{
				path: ROUTES.DASHBOARD,
				element: <DashboardPage />,
			},
			{
				path: ROUTES.DASHBOARD_DETAIL,
				element: <DashboardPage />,
			},
		],
	},
]);

export default router;
