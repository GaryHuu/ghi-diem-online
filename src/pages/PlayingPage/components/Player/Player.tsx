import { InputScore } from '@/components';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { Player as PlayerType } from '@/utils/types';
import {
	ArrowDownwardSharp as ArrowDownwardSharpIcon,
	ArrowUpward as ArrowUpwardIcon,
} from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { usePlaying } from '../../hooks';
import styles from './styles';

type Props = {
	player: PlayerType;
	onRename: (player: PlayerType) => void;
};

function Player({ player, onRename }: Props) {
	const setting = useAppSelector((state: RootState) => state.setting);
	const { match, onScorePlayerChange, onAutoFillScore } = usePlaying();
	const currentGameNumber = match?.current ?? 1;
	const total = player.scores.slice(0, currentGameNumber).reduce((acc, score) => acc + score, 0);
	const increasingTrendValue = player.scores[currentGameNumber - 2] || 0;
	const isFinished = match?.data.isFinished ?? false;
	const currentValue = player.scores[currentGameNumber - 1] || 0;

	const handleScoreChange = (newValue: number) => {
		onScorePlayerChange(player.id, currentGameNumber, newValue);
	};

	const handleAutoFill = () => {
		onAutoFillScore(player.id, currentGameNumber);
	};

	return (
		<Stack sx={styles.wrapper}>
			<Stack sx={styles.titleWrapper}>
				<Typography sx={styles.title} onClick={() => onRename(player)}>
					{player.name}
				</Typography>
				<Stack sx={styles.scoreWrapper}>
					<Typography sx={styles.score(total)}>Điểm: {total}</Typography>
					{currentGameNumber !== 1 && !isFinished && (
						<Stack sx={styles.trendWrapper(increasingTrendValue)}>
							<Box>{`(`}</Box>
							{increasingTrendValue >= 0 && <ArrowUpwardIcon sx={styles.trendIndicator} />}
							{increasingTrendValue < 0 && <ArrowDownwardSharpIcon sx={styles.trendIndicator} />}
							<Typography sx={styles.trendMetric}>{increasingTrendValue}</Typography>
							<Box>{`)`}</Box>
						</Stack>
					)}
				</Stack>
			</Stack>
			<Stack gap="0.25rem">
				<InputScore
					disabled={isFinished}
					value={currentValue}
					onChange={handleScoreChange}
					gap={setting.gap}
				/>
				{!isFinished && (
					<Typography sx={styles.autoFill} onClick={handleAutoFill}>
						Tự động điền
					</Typography>
				)}
			</Stack>
		</Stack>
	);
}

export default Player;
