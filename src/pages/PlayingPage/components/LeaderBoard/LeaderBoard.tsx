import { Dialog } from '@/components';
import { useBoolean, useFormatCurrency } from '@/hooks';
import helpers from '@/utils/helpers';
import { ArrowBack as ArrowBackIcon, Paid as PaidIcon } from '@mui/icons-material';
import { Avatar, Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { usePlaying } from '../../hooks';
import TopOne from '../TopOne';
import Transactions from '../Transactions';
import styles from './styles';

function LeaderBoard() {
	const { t } = useTranslation();
	const { isShowResult, leaderBoardPlayers, toggleShowResult } = usePlaying();
	const {
		value: isOpenTransactions,
		setTrue: openTransactions,
		setFalse: closeTransactions,
	} = useBoolean(false);

	const handleShowTransactions = () => {
		toggleShowResult();
		openTransactions();
	};

	const handleCloseTransaction = () => {
		closeTransactions();
		toggleShowResult();
	};

	return (
		<>
			<Transactions isOpen={isOpenTransactions} onClose={handleCloseTransaction} />
			<Dialog isOpen={isShowResult} fullScreen>
				<Dialog.DialogTitle>
					<Stack sx={styles.headerWrapper}>
						<IconButton sx={styles.p0} onClick={toggleShowResult}>
							<ArrowBackIcon />
						</IconButton>
						{t('pages.playing.leaderboard')}
						<Button
							variant="outlined"
							onClick={handleShowTransactions}
							sx={{
								animation: 'pulse 2s infinite',
								'@keyframes pulse': {
									'0%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)' },
									'70%': { boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)' },
									'100%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)' },
								},
							}}
						>
							<PaidIcon />
						</Button>
					</Stack>
				</Dialog.DialogTitle>
				<Dialog.DialogContent dividers sx={styles.content}>
					{leaderBoardPlayers[0] && <TopOne {...leaderBoardPlayers[0]} />}
					<Box sx={styles.leaderBoardPlayers}>
						{leaderBoardPlayers.slice(1).map((p, index) => (
							<Player key={p.id} top={index + 2} {...p} />
						))}
					</Box>
				</Dialog.DialogContent>
			</Dialog>
		</>
	);
}

export default LeaderBoard;

type PlayerProps = {
	top: number;
	name: string;
	score: number;
	avatar?: string;
};

const Player = ({ top, name, score, avatar }: PlayerProps) => {
	const { formatCurrency } = useFormatCurrency();

	return (
		<Box sx={styles.player}>
			<Box sx={styles.playerLeftInfo}>
				<Typography sx={styles.top}>{top}</Typography>
				<Avatar src={avatar} sx={styles.playerAvatar(name)}>
					{helpers.getShortName(name)}
				</Avatar>
				<Typography sx={styles.playerName}>{name}</Typography>
			</Box>
			<Typography sx={styles.score}>{formatCurrency(score)}</Typography>
		</Box>
	);
};
