import { InputScore } from '@/components';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { Player as PlayerType } from '@/utils/types';
import {
	ArrowDownwardSharp as ArrowDownwardSharpIcon,
	ArrowUpward as ArrowUpwardIcon,
	Speed as SpeedIcon,
} from '@mui/icons-material';
import { Box, Checkbox, FormControlLabel, Popover, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlaying } from '../../hooks';
import styles from './styles';

type Props = {
	player: PlayerType;
	onRename: (player: PlayerType) => void;
};

function Player({ player, onRename }: Props) {
	const { t } = useTranslation();
	const setting = useAppSelector((state: RootState) => state.setting);
	const { match, onScorePlayerChange, onToggleAutoFill, onUpdatePlayerGap } = usePlaying();
	const currentGameNumber = match?.current ?? 1;
	const total = player.scores.slice(0, currentGameNumber - 1).reduce((acc, score) => acc + score, 0);
	const increasingTrendValue = player.scores[currentGameNumber - 2] || 0;
	const isFinished = match?.data.isFinished ?? false;
	const currentValue = player.scores[currentGameNumber - 1] || 0;
	const effectiveGap = player.gap ?? setting.gap;
	const hasCustomGap = player.gap !== undefined;

	const [gapAnchorEl, setGapAnchorEl] = useState<HTMLElement | null>(null);
	const [gapDisplayValue, setGapDisplayValue] = useState<string>(effectiveGap.toString());

	const handleScoreChange = (newValue: number) => {
		onScorePlayerChange(player.id, currentGameNumber, newValue);
	};

	const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		setGapDisplayValue(raw);
		const num = +raw;
		if (num >= 1) onUpdatePlayerGap(player.id, num);
	};

	const handleGapBlur = () => {
		const num = +gapDisplayValue;
		if (num < 1 || isNaN(num)) {
			setGapDisplayValue(effectiveGap.toString());
		}
	};

	const handleOpenGapPopover = (e: React.MouseEvent<HTMLElement>) => {
		setGapDisplayValue(effectiveGap.toString());
		setGapAnchorEl(e.currentTarget);
	};

	const handleResetGap = () => {
		onUpdatePlayerGap(player.id, undefined);
		setGapAnchorEl(null);
	};

	return (
		<Stack sx={styles.wrapper}>
			<Stack sx={styles.titleWrapper}>
				<Typography sx={styles.title} onClick={() => onRename(player)}>
					{player.name}
				</Typography>
				<Stack sx={styles.scoreWrapper}>
					<Typography sx={styles.score(total)}>
						{t('pages.playing.scoreLabel', { total })}
					</Typography>
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
					disabled={isFinished || !!player.autoFill}
					value={currentValue}
					onChange={handleScoreChange}
					gap={effectiveGap}
				/>
				{!isFinished && (
					<Stack direction="row" alignItems="center" justifyContent="center" gap="0.5rem">
						<FormControlLabel
							control={
								<Checkbox
									checked={!!player.autoFill}
									onChange={() => onToggleAutoFill(player.id)}
									size="small"
									sx={{ p: '2px' }}
								/>
							}
							label={
								<Typography sx={{ fontSize: '14px' }}>
									{t('common.buttons.autoFill')}
								</Typography>
							}
							sx={{ m: 0 }}
						/>
						<Stack
							direction="row"
							alignItems="center"
							onClick={handleOpenGapPopover}
							sx={styles.gapBadge(hasCustomGap)}
						>
							<SpeedIcon sx={{ fontSize: '14px' }} />
							<Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>
								{effectiveGap}
							</Typography>
						</Stack>
						<Popover
							open={Boolean(gapAnchorEl)}
							anchorEl={gapAnchorEl}
							onClose={() => setGapAnchorEl(null)}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
							transformOrigin={{ vertical: 'top', horizontal: 'center' }}
						>
							<Stack sx={{ p: '12px 16px', width: '180px' }}>
								<Typography sx={{ fontSize: '13px', fontWeight: 'bold', mb: '8px' }}>
									{t('pages.playing.individualGap')}
								</Typography>
								<TextField
									type="number"
									value={gapDisplayValue}
									onChange={handleGapChange}
									onBlur={handleGapBlur}
									size="small"
									inputProps={{ min: 1 }}
									autoFocus
								/>
								{hasCustomGap && (
									<Typography
										onClick={handleResetGap}
										sx={styles.resetGap}
									>
										{t('pages.playing.resetToGlobal')}
									</Typography>
								)}
							</Stack>
						</Popover>
					</Stack>
				)}
			</Stack>
		</Stack>
	);
}

export default Player;
