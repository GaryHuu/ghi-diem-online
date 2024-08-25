import {
	DialogActions,
	DialogContent,
	DialogContentProps,
	DialogContentText,
	Dialog as DialogMUI,
	DialogProps,
	DialogTitle,
	Slide,
} from '@mui/material';
import React, { ReactNode, Ref } from 'react';

type Props = {
	isOpen: boolean;
	onClose?: () => void;
	children: ReactNode | Element[] | Element;
} & Omit<DialogProps, 'open' | 'onClose'>;

function Dialog({ isOpen, onClose = () => {}, children, ...other }: Props) {
	return (
		<DialogMUI
			open={isOpen}
			onClose={onClose}
			scroll="paper"
			fullWidth
			TransitionComponent={Transition}
			{...other}
		>
			<>{children}</>
		</DialogMUI>
	);
}

export default Dialog;

Dialog.DialogTitle = DialogTitle;
Dialog.DialogContentText = DialogContentText;
Dialog.DialogActions = DialogActions;

Dialog.DialogContent = function CustomDialogContent({ children, ...rest }: DialogContentProps) {
	const { sx, ...other } = rest;
	return (
		<DialogContent
			dividers
			sx={{
				padding: '16px',
				...sx,
			}}
			{...other}
		>
			{children}
		</DialogContent>
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Transition = React.forwardRef(function Transition(props: any, ref: Ref<unknown>) {
	return <Slide direction="up" ref={ref} {...props} />;
});
