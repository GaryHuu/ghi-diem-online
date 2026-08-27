import { Dialog } from '@/components';
import { Button } from '@mui/material';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export type ConfirmOptions = {
	titleKey?: string;
	bodyKey?: string;
	bodyParams?: Record<string, unknown>;
	confirmKey?: string;
	cancelKey?: string;
	autoFocusCancel?: boolean;
};

export type ConfirmModalRef = {
	confirm: (callback: () => void, options?: ConfirmOptions) => void;
};

const ConfirmModal = React.forwardRef<ConfirmModalRef>((_props, ref) => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const [options, setOptions] = useState<ConfirmOptions>({});
	const confirmCallback = useRef<() => void>();

	useImperativeHandle(ref, () => ({
		confirm: (callback, nextOptions) => {
			setOptions(nextOptions ?? {});
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

	const titleKey = options.titleKey ?? 'components.confirmModal.title';
	const bodyKey = options.bodyKey ?? 'components.confirmModal.content';

	return (
		<Dialog isOpen={isOpen}>
			<Dialog.DialogTitle>{t(titleKey)}</Dialog.DialogTitle>
			<Dialog.DialogContent dividers sx={{ borderBottom: 'none' }}>
				<Dialog.DialogContentText>
					<Trans i18nKey={bodyKey} values={options.bodyParams} components={{ br: <br /> }} />
				</Dialog.DialogContentText>
			</Dialog.DialogContent>
			<Dialog.DialogActions>
				<Button onClick={handleCancel} color="inherit" autoFocus={options.autoFocusCancel}>
					{t(options.cancelKey ?? 'components.confirmModal.cancel')}
				</Button>
				<Button onClick={handleConfirm} autoFocus={!options.autoFocusCancel}>
					{t(options.confirmKey ?? 'components.confirmModal.confirm')}
				</Button>
			</Dialog.DialogActions>
		</Dialog>
	);
});

ConfirmModal.displayName = 'Confirm Modal';

export default ConfirmModal;
