import { ConfirmModal } from '@/components';
import { Dialog } from '@/components';
import { DATE_FORMAT } from '@/utils/constants';
import { Match } from '@/utils/types';
import helpers from '@/utils/helpers';
import {
	Delete as DeleteIcon,
	SentimentVeryDissatisfied as SentimentVeryDissatisfiedIcon,
} from '@mui/icons-material';
import {
	Avatar,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { ReactNode } from 'react';
import styles from './styles';
import useListingMatchesDialog from './useListingMatchesDialog';

type Props = {
	children: ReactNode;
};

function ListingMatchesDialog({ children }: Props) {
	const { isOpen, onOpen, onClose, matches, onItemClick, onDeleteItem, confirmActionRef } =
		useListingMatchesDialog();

	return (
		<>
			{React.cloneElement(children as React.ReactElement, {
				onClick: onOpen,
			})}
			<Dialog onClose={onClose} isOpen={isOpen}>
				<Dialog.DialogTitle>Chọn trận đấu</Dialog.DialogTitle>
				<Dialog.DialogContent sx={styles.dialogContent}>
					<List sx={styles.list}>
						{matches.map((match) => (
							<Item key={match.id} match={match} onClick={onItemClick} onDelete={onDeleteItem} />
						))}
					</List>
					{matches.length === 0 && <Empty />}
				</Dialog.DialogContent>
			</Dialog>
			<ConfirmModal ref={confirmActionRef} />
		</>
	);
}

export default ListingMatchesDialog;

const Item = ({
	match,
	onDelete,
	onClick,
}: {
	match: Match;
	onDelete: (id: number) => void;
	onClick: (id: number) => void;
}) => (
	<ListItem
		disablePadding
		key={match.id}
		secondaryAction={
			<IconButton edge="end" aria-label="delete" onClick={() => onDelete(match.id)}>
				<DeleteIcon />
			</IconButton>
		}
	>
		<ListItemButton onClick={() => onClick(match.id)}>
			<ListItemAvatar>
				<Avatar
					sx={{
						backgroundColor: helpers.stringToColor(match.name),
					}}
				>
					{helpers.getShortName(match.name)}
				</Avatar>
			</ListItemAvatar>
			<ListItemText primary={match.name} secondary={dayjs(match.id).format(DATE_FORMAT)} />
		</ListItemButton>
	</ListItem>
);

const Empty = () => (
	<Typography textAlign="center" p={3} sx={styles.empty}>
		<SentimentVeryDissatisfiedIcon />
		Bạn chưa bắt đầu bất kỳ ván nào
	</Typography>
);
