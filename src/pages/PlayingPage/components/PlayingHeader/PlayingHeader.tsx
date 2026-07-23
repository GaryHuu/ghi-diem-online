import {
	KeyboardArrowLeft as KeyboardArrowLeftIcon,
	KeyboardArrowRight as KeyboardArrowRightIcon,
	KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
	Share as ShareIcon,
} from '@mui/icons-material';
import { Box, Button, IconButton, LinearProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useBoolean } from '@/hooks';
import { usePlaying } from '../../hooks';
import ShareLinkDialog from '../ShareLinkDialog';
import styles from './styles';

function PlayingHeader() {
	const { t } = useTranslation();
	const { match, onShowGameNumber, moveToEnd } = usePlaying();
	const { value: isShareOpen, setTrue: openShare, setFalse: closeShare } = useBoolean(false);
	const currentGame = match?.current;
	const totalGame = match?.total;
	const matchId = match?.data.id;
	const isShowMoveToLast = totalGame && currentGame && totalGame - currentGame > 1;
	const progress = currentGame && totalGame ? (currentGame / totalGame) * 100 : 0;

	const onChangeGame = (gameNumber: number) => () => {
		onShowGameNumber(gameNumber);
	};

	return (
		<Box sx={styles.wrapper}>
			<Stack
				sx={styles.inner}
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				gap="12px"
			>
				<Stack gap="2px" sx={{ flex: 1, minWidth: 0 }}>
					<Typography sx={styles.matchTitle}>
						{t('pages.playing.matchLabel', { name: match?.data.name })}
					</Typography>
					<Stack direction="row" alignItems="center" gap="2px">
						{currentGame && currentGame > 1 && (
							<IconButton sx={styles.p0} onClick={onChangeGame(currentGame - 1)}>
								<KeyboardArrowLeftIcon color="primary" />
							</IconButton>
						)}
						<Box sx={styles.roundPill}>
							<Typography sx={styles.roundPillText}>
								{t('pages.playing.roundProgress', { current: currentGame, total: totalGame })}
							</Typography>
						</Box>
						{currentGame && totalGame && currentGame < totalGame && (
							<IconButton sx={styles.p0} onClick={onChangeGame(currentGame + 1)}>
								<KeyboardArrowRightIcon color="primary" />
							</IconButton>
						)}
						{isShowMoveToLast && (
							<IconButton sx={styles.p0} onClick={moveToEnd}>
								<KeyboardDoubleArrowRightIcon color="primary" />
							</IconButton>
						)}
					</Stack>
				</Stack>
				<Button
					variant="outlined"
					size="medium"
					startIcon={<ShareIcon />}
					onClick={openShare}
					sx={styles.shareButton}
				>
					<Typography sx={styles.shareLabel}>{t('components.shareLink.action')}</Typography>
				</Button>
			</Stack>
			<LinearProgress variant="determinate" value={progress} sx={styles.progressBar} />
			<ShareLinkDialog isOpen={isShareOpen} onClose={closeShare} matchId={matchId} />
		</Box>
	);
}

export default PlayingHeader;
