import { useAppDispatch } from '@/redux/hooks';
import { updateCurrentGame } from '@/redux/slices/matchSlice';
import {
	KeyboardArrowLeft as KeyboardArrowLeftIcon,
	KeyboardArrowRight as KeyboardArrowRightIcon,
	KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
	Leaderboard as LeaderboardIcon,
} from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LeaderBoard, Player, PlayingLayout } from '../PlayingPage/components';
import { usePlaying } from '../PlayingPage/hooks';
import { useSharedView } from './hooks';
import styles from './styles';

function SharedViewPage() {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { isLoading, hasError } = useSharedView();
	const { match, toggleShowResult } = usePlaying();

	const onChangeGame = (gameNumber: number) => () => {
		dispatch(updateCurrentGame(gameNumber));
	};

	if (isLoading) {
		return (
			<Box sx={styles.stateWrapper}>
				<CircularProgress />
			</Box>
		);
	}

	if (hasError || !match) {
		return (
			<Box sx={styles.stateWrapper}>
				<Typography>{t('pages.shared.notFound')}</Typography>
			</Box>
		);
	}

	const players = match.data.players;

	return (
		<PlayingLayout>
			<Stack
				sx={styles.header}
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				gap="12px"
			>
				<Stack sx={{ minWidth: 0 }}>
					<Typography sx={styles.matchTitle}>
						{t('pages.playing.matchLabel', { name: match.data.name })}
					</Typography>
					<Stack direction="row" alignItems="center" gap="2px">
						{match.current > 1 && (
							<IconButton sx={styles.p0} onClick={onChangeGame(match.current - 1)}>
								<KeyboardArrowLeftIcon color="primary" />
							</IconButton>
						)}
						<Box sx={styles.roundPill}>
							<Typography sx={styles.roundPillText}>
								{t('pages.playing.roundProgress', {
									current: match.current,
									total: match.total,
								})}
							</Typography>
						</Box>
						{match.current < match.total && (
							<IconButton sx={styles.p0} onClick={onChangeGame(match.current + 1)}>
								<KeyboardArrowRightIcon color="primary" />
							</IconButton>
						)}
						{match.total - match.current > 1 && (
							<IconButton sx={styles.p0} onClick={onChangeGame(match.total)}>
								<KeyboardDoubleArrowRightIcon color="primary" />
							</IconButton>
						)}
						<Typography sx={styles.liveBadge} ml="6px">
							{t('pages.shared.liveBadge')}
						</Typography>
					</Stack>
				</Stack>
				<IconButton
					color="primary"
					onClick={toggleShowResult}
					aria-label={t('pages.playing.leaderboard')}
				>
					<LeaderboardIcon />
				</IconButton>
			</Stack>
			<LeaderBoard />
			<Box sx={styles.players}>
				{players.map((player) => (
					<Player key={player.id} player={player} onRename={() => {}} readOnly />
				))}
			</Box>
		</PlayingLayout>
	);
}

export default SharedViewPage;
