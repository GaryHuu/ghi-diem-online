import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { TEXT_CONFIG } from './constants';

const ConfirmModal = React.forwardRef((_props, ref) => {
	const [isOpen, setIsOpen] = useState(false);
	const confirmCallback = useRef<() => void>();

	useImperativeHandle(ref, () => ({
		confirm: (callback: () => void) => {
			setIsOpen(true);
			confirmCallback.current = callback;
		},
	}));

	const handleConfirm = () => {
		setIsOpen(false);
		confirmCallback.current?.();
	};

	const handleCancel = () => {
		setIsOpen(false);
		confirmCallback.current = undefined;
	};

	return (
		<Dialog
			open={isOpen}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{TEXT_CONFIG.TITLE}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">{TEXT_CONFIG.CONTENT}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel} color="inherit">
					{TEXT_CONFIG.CANCEL}
				</Button>
				<Button onClick={handleConfirm} autoFocus>
					{TEXT_CONFIG.CONFIRM}
				</Button>
			</DialogActions>
		</Dialog>
	);
});

ConfirmModal.displayName = 'Confirm Modal';

export default ConfirmModal;
