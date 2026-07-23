import {
	ArrowForward as ArrowForwardIcon,
	FlagOutlined as FlagOutlinedIcon,
	Leaderboard as LeaderboardIcon,
} from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ConfirmOptions } from '@/components/ConfirmModal/ConfirmModal';
import { usePlaying } from '../../hooks';
import styles from './styles';

type Props = {
	onConfirm: (callback: () => void, options?: ConfirmOptions) => void;
};

function PlayingActionBar({ onConfirm }: Props) {
	const { t } = useTranslation();
	const { match, onPlayContinue, toggleShowResult, onFinish } = usePlaying();
	const currentGame = match?.current;
	const totalGame = match?.total;
	const isFinished = match?.data.isFinished;
	const isLastGame = currentGame === totalGame;
	const canEndMatch = !isFinished && isLastGame;

	const handleNextRound = () =>
		onConfirm(onPlayContinue, {
			titleKey: 'pages.playing.confirmNextRoundTitle',
			bodyKey: 'pages.playing.confirmNextRoundBody',
			bodyParams: { current: currentGame },
		});

	const handleEndMatch = () =>
		onConfirm(onFinish, {
			titleKey: 'pages.playing.confirmEndMatchTitle',
			bodyKey: 'pages.playing.confirmEndMatchBody',
		});

	const primaryButton = isFinished ? (
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
	) : isLastGame ? (
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
	) : null;

	return (
		<Box sx={styles.wrapper}>
			<Stack gap="8px">
				{primaryButton}
				<Button
					fullWidth
					variant="outlined"
					size="large"
					startIcon={<FlagOutlinedIcon />}
					onClick={handleEndMatch}
					disabled={!canEndMatch}
				>
					{t('pages.playing.endMatch')}
				</Button>
			</Stack>
		</Box>
	);
}

export default PlayingActionBar;
