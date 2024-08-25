import { ToastContainer as ToastContainerLib } from 'react-toastify';

function ToastContainer() {
	return (
		<ToastContainerLib
			position="top-center"
			autoClose={3000}
			limit={3}
			closeOnClick
			theme="light"
		/>
	);
}

export default ToastContainer;
