import {
	ArrowForward as ArrowForwardIcon,
	Leaderboard as LeaderboardIcon,
} from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ConfirmOptions } from '@/components/ConfirmModal/ConfirmModal';
import { usePlaying } from '../../hooks';
import styles from './styles';

type Props = {
	onConfirm: (callback: () => void, options?: ConfirmOptions) => void;
};

function PlayingActionBar({ onConfirm }: Props) {
	const { t } = useTranslation();
	const { match, onPlayContinue, toggleShowResult } = usePlaying();
	const currentGame = match?.current;
	const totalGame = match?.total;
	const isFinished = match?.data.isFinished;
	const isLastGame = currentGame === totalGame;

	if (isFinished) {
		return (
			<Box sx={styles.wrapper}>
				<Button
					fullWidth
					variant="contained"
					size="large"
					startIcon={<LeaderboardIcon />}
					onClick={toggleShowResult}
					sx={styles.primaryButton}
				>
					<Typography sx={styles.primaryLabel}>{t('pages.playing.leaderboard')}</Typography>
				</Button>
			</Box>
		);
	}

	if (!isLastGame) return null;

	const handleNextRound = () =>
		onConfirm(onPlayContinue, {
			titleKey: 'pages.playing.confirmNextRoundTitle',
			bodyKey: 'pages.playing.confirmNextRoundBody',
			bodyParams: { current: currentGame },
		});

	return (
		<Box sx={styles.wrapper}>
			<Button
				fullWidth
				variant="contained"
				size="large"
				endIcon={<ArrowForwardIcon />}
				onClick={handleNextRound}
				sx={styles.primaryButton}
			>
				<Typography sx={styles.primaryLabel}>{t('pages.playing.nextRound')}</Typography>
			</Button>
		</Box>
	);
}

export default PlayingActionBar;
