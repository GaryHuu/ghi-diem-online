import {
	KeyboardArrowLeft as KeyboardArrowLeftIcon,
	KeyboardArrowRight as KeyboardArrowRightIcon,
	KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
	Leaderboard as LeaderboardIcon,
} from '@mui/icons-material';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import { usePlaying } from '../../hooks';
import styles from './styles';
type Props = {
	onConfirm: (callback: () => void) => void;
};

function PlayingHeader({ onConfirm }: Props) {
	const { match, onShowGameNumber, onPlayContinue, onFinish, moveToEnd, toggleShowResult } =
		usePlaying();
	const currentGame = match?.current;
	const totalGame = match?.total;
	const isFinished = match?.data.isFinished;
	const isLastGame = currentGame === totalGame;
	const isShowMoveToLast = totalGame && currentGame && totalGame - currentGame > 1;

	const onChangeGame = (gameNumber: number) => () => {
		onShowGameNumber(gameNumber);
	};

	return (
		<Stack justifyContent="space-between" direction="row" sx={styles.wrapper}>
			<Stack gap="2px">
				<Typography sx={styles.matchTitle}>Trận: {match?.data.name}</Typography>
				<Stack direction="row" alignItems="center" gap="2px">
					{currentGame && currentGame > 1 && (
						<IconButton sx={styles.p0} onClick={onChangeGame(currentGame - 1)}>
							<KeyboardArrowLeftIcon color="primary" />
						</IconButton>
					)}
					<Typography sx={styles.gameNumber}>Ván: {match?.current}</Typography>
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
			<Stack alignItems="center" direction="row" gap="0.5rem">
				{isFinished && (
					<Button variant="outlined" startIcon={<LeaderboardIcon />} onClick={toggleShowResult}>
						<Typography sx={styles.f13Bold}>Bảng xếp hạng</Typography>
					</Button>
				)}
				{!isFinished && isLastGame && (
					<>
						<Button variant="outlined" onClick={() => onConfirm(onPlayContinue)}>
							<Typography sx={styles.next}>Chơi tiếp</Typography>
						</Button>
						<Button variant="contained" onClick={() => onConfirm(onFinish)}>
							<Typography sx={styles.f13Bold}>Kết thúc</Typography>
						</Button>
					</>
				)}
			</Stack>
		</Stack>
	);
}

export default PlayingHeader;
