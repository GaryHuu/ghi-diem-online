import type { ConfirmOptions } from '@/components/ConfirmModal/ConfirmModal';
import {
	FlagOutlined as FlagOutlinedIcon,
	KeyboardArrowLeft as KeyboardArrowLeftIcon,
	KeyboardArrowRight as KeyboardArrowRightIcon,
	KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
} from '@mui/icons-material';
import { Box, Button, IconButton, LinearProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { usePlaying } from '../../hooks';
import styles from './styles';

type Props = {
	onConfirm: (callback: () => void, options?: ConfirmOptions) => void;
};

function PlayingHeader({ onConfirm }: Props) {
	const { t } = useTranslation();
	const { match, onShowGameNumber, moveToEnd, onFinish } = usePlaying();
	const currentGame = match?.current;
	const totalGame = match?.total;
	const isFinished = match?.data.isFinished ?? false;
	const isLastGame = !!currentGame && currentGame === totalGame;
	const isShowMoveToLast = totalGame && currentGame && totalGame - currentGame > 1;
	const progress = currentGame && totalGame ? (currentGame / totalGame) * 100 : 0;
	const canEndMatch = !isFinished && isLastGame;

	const onChangeGame = (gameNumber: number) => () => {
		onShowGameNumber(gameNumber);
	};

	const handleEndMatch = () =>
		onConfirm(onFinish, {
			titleKey: 'pages.playing.confirmEndMatchTitle',
			bodyKey: 'pages.playing.confirmEndMatchBody',
		});

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
					startIcon={<FlagOutlinedIcon />}
					onClick={handleEndMatch}
					disabled={!canEndMatch}
					sx={styles.endMatchButton}
				>
					<Typography sx={styles.endMatchLabel}>{t('pages.playing.endMatch')}</Typography>
				</Button>
			</Stack>
			<LinearProgress variant="determinate" value={progress} sx={styles.progressBar} />
		</Box>
	);
}

export default PlayingHeader;
