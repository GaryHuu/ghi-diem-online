import { useColorScheme } from '@mui/material/styles';
import { ToastContainer as ToastContainerLib } from 'react-toastify';

function ToastContainer() {
	const { mode, systemMode } = useColorScheme();
	const resolvedMode = mode === 'system' ? systemMode : mode;
	const theme = resolvedMode === 'dark' ? 'dark' : 'light';

	return (
		<ToastContainerLib
			position="top-center"
			autoClose={3000}
			limit={3}
			closeOnClick
			hideProgressBar
			theme={theme}
		/>
	);
}

export default ToastContainer;
