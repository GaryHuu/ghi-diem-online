import { Button, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import React, { forwardRef, useImperativeHandle, useRef, useState, ReactNode, Ref } from 'react';
import { MAX_LENGTH, MIN_LENGTH } from './constants';
import { Mode } from './enums';

const Transition = forwardRef(function Transition(props: any, ref: Ref<unknown>) {
	return <Slide direction="up" ref={ref} {...props} />;
});

type Player = {
	id: string;
	name: string;
};

type Props = {
	children: ReactNode;
	onSubmit?: (name: string, id?: string) => void;
};

const PlayerModifierDialog = forwardRef(
	({ children, onSubmit = () => {} }: Props, ref: Ref<any>) => {
		const [mode, setMode] = useState<Mode>(Mode.Create);
		const [isOpen, setIsOpen] = useState(false);
		const editedPlayerRef = useRef<Player | null>(null);
		const [name, setName] = useState('');
		const [isDirty, setIsDirty] = useState(false);

		const invalid = name.trim().length < MIN_LENGTH || name.trim().length > MAX_LENGTH;

		const isError = invalid && isDirty;

		const helperText = isError ? `Vui lòng nhập từ ${MIN_LENGTH} đến ${MAX_LENGTH} kí tự` : '';

		const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			if (event.target.value.length <= MAX_LENGTH) {
				setName(event.target.value);
			}
		};

		const handleSubmit = () => {
			if (invalid) {
				setIsDirty(true);
				return;
			}

			if (mode === Mode.Create) {
				onSubmit(name);
			}

			if (mode === Mode.Edit) {
				onSubmit(name, editedPlayerRef.current?.id);
			}

			handleClose();
		};

		const handleClose = () => {
			setIsOpen(false);
			setIsDirty(false);
			setName('');
			setMode(Mode.Create);
			editedPlayerRef.current = null;
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		};

		useImperativeHandle(ref, () => ({
			editPlayerName: (player: Player) => {
				setIsOpen(true);
				setMode(Mode.Edit);
				setName(player.name);
				editedPlayerRef.current = player;
			},
		}));

		return (
			<>
				{React.cloneElement(children as React.ReactElement, {
					onClick: () => setIsOpen(true),
				})}
				<Dialog
					onClose={handleClose}
					open={isOpen}
					TransitionComponent={Transition}
					scroll="paper"
					fullWidth
				>
					<DialogTitle>
						{mode === Mode.Create ? 'Thêm người chơi' : 'Sửa tên người chơi'}
					</DialogTitle>
					<DialogContent
						dividers
						sx={{
							padding: '1.5rem 1rem 1rem',
						}}
					>
						<TextField
							error={isError}
							label="Tên người chơi"
							id="name-of-player"
							size="small"
							value={name}
							onChange={handleNameChange}
							onBlur={() => setIsDirty(true)}
							sx={{ width: '100%' }}
							helperText={helperText}
						/>
						<Button
							sx={{ mt: '1rem', width: '100%' }}
							variant="contained"
							size="small"
							disabled={isError}
							onClick={handleSubmit}
						>
							{mode === Mode.Create ? 'Tạo' : 'Sửa'}
						</Button>
					</DialogContent>
				</Dialog>
			</>
		);
	},
);

PlayerModifierDialog.displayName = 'PlayerModifierDialog';

export default PlayerModifierDialog;
