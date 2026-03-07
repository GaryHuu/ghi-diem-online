import { Dialog } from '@/components';
import helpers from '@/utils/helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import { CameraAlt as CameraAltIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Avatar, Badge, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import React, {
	forwardRef,
	ReactNode,
	Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { schema } from './schema';
import styles from './styles';
import { Mode, PlayerForm } from './types';

type Props = {
	children: ReactNode;
	onSubmit?: (name: string, id?: number) => void;
	onAvatarChange?: (playerId: number, avatar?: string) => void;
};

export type PlayerModifierDialogRefType = {
	editPlayerName: (player: PlayerForm) => void;
};

const MAX_AVATAR_SIZE = 200;

const resizeImage = (file: File): Promise<string> => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				const size = Math.min(img.width, img.height);
				const sx = (img.width - size) / 2;
				const sy = (img.height - size) / 2;
				canvas.width = MAX_AVATAR_SIZE;
				canvas.height = MAX_AVATAR_SIZE;
				const ctx = canvas.getContext('2d')!;
				ctx.drawImage(img, sx, sy, size, size, 0, 0, MAX_AVATAR_SIZE, MAX_AVATAR_SIZE);
				resolve(canvas.toDataURL('image/jpeg', 0.7));
			};
			img.src = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	});
};

const PlayerModifierDialog = forwardRef(
	(
		{ children, onSubmit = () => {}, onAvatarChange }: Props,
		ref: Ref<PlayerModifierDialogRefType>,
	) => {
		const { t } = useTranslation();
		const [mode, setMode] = useState<Mode>(Mode.Create);
		const [isOpen, setIsOpen] = useState(false);
		const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
		const editedPlayerRef = useRef<PlayerForm | null>(null);
		const fileInputRef = useRef<HTMLInputElement>(null);

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
			setAvatarPreview(undefined);
			editedPlayerRef.current = null;
			helpers.scrollToTop();
		};

		const onSubmitForm = (data: { name: string }) => {
			const value = data.name.trim();

			if (mode === Mode.Create) {
				const names = value.split(',');
				names.forEach((name, index) => {
					setTimeout(() => {
						onSubmit(name.trim(), editedPlayerRef.current?.id);
					}, index);
				});
			}

			if (mode === Mode.Edit) {
				onSubmit(value, editedPlayerRef.current?.id);
			}

			handleClose();
		};

		const handleAvatarClick = () => {
			fileInputRef.current?.click();
		};

		const handleFileChange = useCallback(
			async (e: React.ChangeEvent<HTMLInputElement>) => {
				const file = e.target.files?.[0];
				if (!file || !editedPlayerRef.current?.id) return;

				const base64 = await resizeImage(file);
				setAvatarPreview(base64);
				onAvatarChange?.(editedPlayerRef.current.id, base64);

				if (fileInputRef.current) fileInputRef.current.value = '';
			},
			[onAvatarChange],
		);

		const handleRemoveAvatar = () => {
			if (!editedPlayerRef.current?.id) return;
			setAvatarPreview(undefined);
			onAvatarChange?.(editedPlayerRef.current.id, undefined);
		};

		useImperativeHandle(ref, () => ({
			editPlayerName: (player: PlayerForm) => {
				setIsOpen(true);
				setMode(Mode.Edit);
				setValue('name', player?.name ?? '');
				setAvatarPreview(player?.avatar);
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
							{mode === Mode.Create
								? t('components.playerModifier.titleCreate')
								: t('components.playerModifier.titleEdit')}
						</Dialog.DialogTitle>
						<Dialog.DialogContent sx={styles.dialogContent} dividers>
							{mode === Mode.Edit && (
								<Stack alignItems="center" mb="1rem">
									<Badge
										overlap="circular"
										anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
										badgeContent={
											avatarPreview ? (
												<IconButton
													size="small"
													onClick={handleRemoveAvatar}
													sx={styles.avatarBadgeBtn}
												>
													<DeleteIcon sx={{ fontSize: 14 }} />
												</IconButton>
											) : (
												<IconButton
													size="small"
													onClick={handleAvatarClick}
													sx={styles.avatarBadgeBtn}
												>
													<CameraAltIcon sx={{ fontSize: 14 }} />
												</IconButton>
											)
										}
									>
										<Avatar
											src={avatarPreview}
											sx={styles.avatarLarge(editedPlayerRef.current?.name)}
											onClick={handleAvatarClick}
										>
											{helpers.getShortName(editedPlayerRef.current?.name ?? '')}
										</Avatar>
									</Badge>
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										hidden
										onChange={handleFileChange}
									/>
								</Stack>
							)}
							<TextField
								{...register('name')}
								error={!!errors.name}
								label={t('components.playerModifier.playerNameLabel')}
								id="name-of-player"
								size="small"
								sx={styles.input}
								helperText={errors.name?.message}
								autoFocus
							/>
							{mode === Mode.Create && (
								<Typography variant="body2" color="text.secondary" sx={styles.tip}>
									{t('components.playerModifier.tip')}
								</Typography>
							)}
						</Dialog.DialogContent>
						<Dialog.DialogActions>
							<Button variant="text" color="inherit" size="small" onClick={handleClose}>
								{t('common.buttons.cancel')}
							</Button>
							<Button variant="contained" size="small" type="submit" disabled={!!errors.name}>
								{mode === Mode.Create ? t('common.buttons.create') : t('common.buttons.edit')}
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
