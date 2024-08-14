import { ToastContainer as ToastContainerLib } from 'react-toastify';

function ToastContainer() {
	return (
		<ToastContainerLib
			position="top-center"
			autoClose={5000}
			hideProgressBar
			newestOnTop={false}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
			theme="light"
		/>
	);
}

export default ToastContainer;
