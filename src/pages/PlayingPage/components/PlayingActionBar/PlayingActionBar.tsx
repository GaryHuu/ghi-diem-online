import {
	ArrowForward as ArrowForwardIcon,
	Leaderboard as LeaderboardIcon,
	Share as ShareIcon,
} from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ConfirmOptions } from '@/components/ConfirmModal/ConfirmModal';
import { useBoolean } from '@/hooks';
import { usePlaying } from '../../hooks';
import ShareLinkDialog from '../ShareLinkDialog';
import styles from './styles';

type Props = {
	onConfirm: (callback: () => void, options?: ConfirmOptions) => void;
};

function PlayingActionBar({ onConfirm }: Props) {
	const { t } = useTranslation();
	const { match, onPlayContinue, toggleShowResult } = usePlaying();
	const { value: isShareOpen, setTrue: openShare, setFalse: closeShare } = useBoolean(false);
	const currentGame = match?.current;
	const totalGame = match?.total;
	const matchId = match?.data.id;
	const isFinished = match?.data.isFinished;
	const isLastGame = currentGame === totalGame;

	const handleNextRound = () =>
		onConfirm(onPlayContinue, {
			titleKey: 'pages.playing.confirmNextRoundTitle',
			bodyKey: 'pages.playing.confirmNextRoundBody',
			bodyParams: { current: currentGame },
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
					startIcon={<ShareIcon />}
					onClick={openShare}
				>
					{t('components.shareLink.action')}
				</Button>
			</Stack>
			<ShareLinkDialog isOpen={isShareOpen} onClose={closeShare} matchId={matchId} />
		</Box>
	);
}

export default PlayingActionBar;
