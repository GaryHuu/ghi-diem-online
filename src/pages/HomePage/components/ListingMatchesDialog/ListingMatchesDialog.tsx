import { ConfirmModal, Dialog } from '@/components';
import { DATE_FORMAT } from '@/utils/constants';
import helpers from '@/utils/helpers';
import { Match } from '@/utils/types';
import {
	Delete as DeleteIcon,
	SentimentVeryDissatisfied as SentimentVeryDissatisfiedIcon,
} from '@mui/icons-material';
import {
	Avatar,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	ListSubheader,
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
	const {
		isOpen,
		onOpen,
		onClose,
		inProgressMatches,
		finishedMatches,
		onItemClick,
		onDeleteItem,
		confirmActionRef,
	} = useListingMatchesDialog();

	return (
		<>
			{React.cloneElement(children as React.ReactElement, {
				onClick: onOpen,
			})}
			<Dialog onClose={onClose} isOpen={isOpen}>
				<Dialog.DialogTitle>Chọn trận đấu</Dialog.DialogTitle>
				<Dialog.DialogContent sx={styles.dialogContent}>
					<List sx={styles.list}>
						<ListSubheader>Đang diễn ra</ListSubheader>
						{inProgressMatches.map((match) => (
							<Item key={match.id} match={match} onClick={onItemClick} onDelete={onDeleteItem} />
						))}
						{inProgressMatches.length === 0 && (
							<Typography sx={styles.empty}>
								<SentimentVeryDissatisfiedIcon color="action" />
								Không có bất kỳ trận đấu nào đang diễn ra
							</Typography>
						)}
						<Divider variant="middle" />
						<ListSubheader>Đã kết thúc</ListSubheader>
						{finishedMatches.map((match) => (
							<Item key={match.id} match={match} onClick={onItemClick} onDelete={onDeleteItem} />
						))}
						{finishedMatches.length === 0 && (
							<Typography sx={styles.empty}>
								<SentimentVeryDissatisfiedIcon color="action" />
								Không có bất kỳ trận đấu nào đã kết thúc
							</Typography>
						)}
					</List>
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
