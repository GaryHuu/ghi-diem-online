import { ConfirmModal } from '@/components';
import db from '@/db';
import { stringAvatar } from '@/helper';
import { ROUTES } from '@/routes/constants';
import DeleteIcon from '@mui/icons-material/Delete';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function ListingMatchesDialog({ children }) {
	const [matches, setMatches] = useState(db.getAllMatches());
	const confirmActionRef = useRef(null);
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);

	const handleListItemClick = (id) => {
		setIsOpen(false);
		const path = generatePath(ROUTES.MATCH, { id });
		navigate(path);
	};

	const handleDelete = (id) => {
		confirmActionRef.current.confirm(() => {
			const newList = db.deleteTheMatch(id);
			setMatches(newList);
		});
	};

	return (
		<>
			{React.cloneElement(children, {
				onClick: () => setIsOpen(true),
			})}
			<Dialog
				onClose={() => setIsOpen(false)}
				open={isOpen}
				TransitionComponent={Transition}
				scroll="paper"
				fullWidth
			>
				<DialogTitle>Chọn trận đấu</DialogTitle>
				<DialogContent
					dividers
					sx={{
						padding: '0',
					}}
				>
					<List sx={{ pt: 0 }}>
						{matches.map((match) => (
							<ListItem
								disablePadding
								key={match.id}
								secondaryAction={
									<IconButton edge="end" aria-label="delete" onClick={() => handleDelete(match.id)}>
										<DeleteIcon />
									</IconButton>
								}
							>
								<ListItemButton onClick={() => handleListItemClick(match.id)}>
									<ListItemAvatar>
										<Avatar {...stringAvatar(match.name)} />
									</ListItemAvatar>
									<ListItemText
										primary={match.name}
										secondary={dayjs(match.id).format('HH:mm DD/MM/YYYY')}
									/>
								</ListItemButton>
							</ListItem>
						))}
					</List>
					{matches.length === 0 && (
						<Typography
							textAlign="center"
							p={3}
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: '4px',
							}}
						>
							<SentimentVeryDissatisfiedIcon />
							Bạn chưa bắt đầu bất kỳ ván nào
						</Typography>
					)}
				</DialogContent>
			</Dialog>
			<ConfirmModal ref={confirmActionRef} />
		</>
	);
}

ListingMatchesDialog.propTypes = {
	children: PropTypes.node,
};

export default ListingMatchesDialog;
