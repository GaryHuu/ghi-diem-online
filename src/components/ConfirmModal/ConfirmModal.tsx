import { Dialog } from '@/components';
import { Button } from '@mui/material';
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
		<Dialog isOpen={isOpen}>
			<Dialog.DialogTitle>{TEXT_CONFIG.TITLE}</Dialog.DialogTitle>
			<Dialog.DialogContent dividers sx={{ borderBottom: 'none' }}>
				<Dialog.DialogContentText>{TEXT_CONFIG.CONTENT}</Dialog.DialogContentText>
			</Dialog.DialogContent>
			<Dialog.DialogActions>
				<Button onClick={handleCancel} color="inherit">
					{TEXT_CONFIG.CANCEL}
				</Button>
				<Button onClick={handleConfirm} autoFocus>
					{TEXT_CONFIG.CONFIRM}
				</Button>
			</Dialog.DialogActions>
		</Dialog>
	);
});

ConfirmModal.displayName = 'Confirm Modal';

export default ConfirmModal;
