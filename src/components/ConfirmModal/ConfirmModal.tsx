import { Dialog } from '@/components';
import { Button } from '@mui/material';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ConfirmModal = React.forwardRef((_props, ref) => {
	const { t } = useTranslation();
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
			<Dialog.DialogTitle>{t('components.confirmModal.title')}</Dialog.DialogTitle>
			<Dialog.DialogContent dividers sx={{ borderBottom: 'none' }}>
				<Dialog.DialogContentText>{t('components.confirmModal.content')}</Dialog.DialogContentText>
			</Dialog.DialogContent>
			<Dialog.DialogActions>
				<Button onClick={handleCancel} color="inherit">
					{t('components.confirmModal.cancel')}
				</Button>
				<Button onClick={handleConfirm} autoFocus>
					{t('components.confirmModal.confirm')}
				</Button>
			</Dialog.DialogActions>
		</Dialog>
	);
});

ConfirmModal.displayName = 'Confirm Modal';

export default ConfirmModal;
