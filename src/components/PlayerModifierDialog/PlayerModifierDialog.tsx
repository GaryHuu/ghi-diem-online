import { Dialog } from '@/components';
import helpers from '@/utils/helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, TextField, Typography } from '@mui/material';
import React, { forwardRef, ReactNode, Ref, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { schema } from './schema';
import styles from './styles';
import { Mode, PlayerForm } from './types';

type Props = {
	children: ReactNode;
	onSubmit?: (name: string, id?: number) => void;
};

export type PlayerModifierDialogRefType = {
	editPlayerName: (player: PlayerForm) => void;
};

const PlayerModifierDialog = forwardRef(
	({ children, onSubmit = () => {} }: Props, ref: Ref<PlayerModifierDialogRefType>) => {
		const [mode, setMode] = useState<Mode>(Mode.Create);
		const [isOpen, setIsOpen] = useState(false);
		const editedPlayerRef = useRef<PlayerForm | null>(null);

		const {
			register,
			handleSubmit,
			reset,
			setValue,
			formState: { errors },
		} = useForm({
			resolver: yupResolver(schema),
			defaultValues: {
				name: '',
			},
		});

		const handleClose = () => {
			setIsOpen(false);
			reset();
			setMode(Mode.Create);
			editedPlayerRef.current = null;
			helpers.scrollToTop();
		};

		const onSubmitForm = (data: { name: string }) => {
			const value = data.name.trim();

			if (mode === Mode.Create) {
				const names = value.split(',');
				names.forEach((name) => {
					onSubmit(name.trim(), editedPlayerRef.current?.id);
				});
			}

			if (mode === Mode.Edit) {
				onSubmit(value, editedPlayerRef.current?.id);
			}

			handleClose();
		};

		useImperativeHandle(ref, () => ({
			editPlayerName: (player: PlayerForm) => {
				setIsOpen(true);
				setMode(Mode.Edit);
				setValue('name', player?.name ?? '');
				editedPlayerRef.current = player;
			},
		}));

		return (
			<>
				{React.cloneElement(children as React.ReactElement, {
					onClick: () => setIsOpen(true),
				})}
				<Dialog isOpen={isOpen}>
					<form onSubmit={handleSubmit(onSubmitForm)}>
						<Dialog.DialogTitle>
							{mode === Mode.Create ? 'Thêm thông tin người chơi' : 'Sửa thông tin người chơi'}
						</Dialog.DialogTitle>
						<Dialog.DialogContent sx={styles.dialogContent} dividers>
							<TextField
								{...register('name')}
								error={!!errors.name}
								label="Tên người chơi"
								id="name-of-player"
								size="small"
								sx={styles.input}
								helperText={errors.name?.message}
								autoFocus
							/>
							{mode === Mode.Create && (
								<Typography variant="body2" color="text.secondary" sx={styles.tip}>
									*Mẹo: Thêm nhiều người chơi bằng cách thêm dấu phẩy (,) giữa các tên người chơi.
								</Typography>
							)}
						</Dialog.DialogContent>
						<Dialog.DialogActions>
							<Button variant="text" color="inherit" size="small" onClick={handleClose}>
								Hủy
							</Button>
							<Button variant="contained" size="small" type="submit" disabled={!!errors.name}>
								{mode === Mode.Create ? 'Tạo' : 'Sửa'}
							</Button>
						</Dialog.DialogActions>
					</form>
				</Dialog>
			</>
		);
	},
);

PlayerModifierDialog.displayName = 'PlayerModifierDialog';

export default PlayerModifierDialog;
