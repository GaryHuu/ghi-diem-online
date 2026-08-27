import { InputScore } from '@/components';
import { useOverlayLock } from '@/components/Dialog/openDialogRegistry';
import { useFlashOnChange } from '@/hooks';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import helpers from '@/utils/helpers';
import { Player as PlayerType } from '@/utils/types';
import {
	DragIndicator as DragIndicatorIcon,
	EditOutlined as EditOutlinedIcon,
	Remove as RemoveIcon,
	Speed as SpeedIcon,
	TrendingDown as TrendingDownIcon,
	TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
	Avatar,
	Box,
	Checkbox,
	FormControlLabel,
	Popover,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { usePlaying } from '../../hooks';
import styles from './styles';

type Props = {
	player: PlayerType;
	onRename: (player: PlayerType) => void;
	dragHandleProps?: DraggableProvidedDragHandleProps;
	isDragEnabled?: boolean;
	readOnly?: boolean;
};

function Player({ player, onRename, dragHandleProps, isDragEnabled, readOnly }: Props) {
	const { t } = useTranslation();
	const setting = useAppSelector((state: RootState) => state.setting);
	const { match, onScorePlayerChange, onToggleAutoFill, onUpdatePlayerGap } = usePlaying();
	const currentGameNumber = match?.current ?? 1;
	const total = player.scores
		.slice(0, currentGameNumber - 1)
		.reduce((acc, score) => acc + score, 0);
	const increasingTrendValue = player.scores[currentGameNumber - 2] || 0;
	const isFinished = match?.data.isFinished ?? false;
	const currentValue = player.scores[currentGameNumber - 1] || 0;
	const effectiveGap = player.gap ?? setting.gap;
	const hasCustomGap = player.gap !== undefined;
	// Live share view: flash values freshly changed by an incoming snapshot.
	// currentGameNumber as context key so browsing rounds does not flash.
	const flashTotal = useFlashOnChange(total, currentGameNumber) && readOnly;
	const flashCurrent = useFlashOnChange(currentValue, currentGameNumber) && readOnly;
	const showDragHandle = !readOnly && isDragEnabled && setting.uiMode === 'full';
	const nameIsDragHandle = !readOnly && !!isDragEnabled && setting.uiMode === 'compact';

	const [gapAnchorEl, setGapAnchorEl] = useState<HTMLElement | null>(null);
	const [gapDisplayValue, setGapDisplayValue] = useState<string>(effectiveGap.toString());
	// The gap Popover bypasses the shared Dialog wrapper, so register it itself.
	useOverlayLock(Boolean(gapAnchorEl));

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

	const showTrend = currentGameNumber !== 1 && !isFinished;

	return (
		<Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
			<Stack sx={styles.wrapper(player.autoFill)}>
				<Stack
					direction="row"
					alignItems="center"
					gap="6px"
					onClick={() => !readOnly && onRename(player)}
					sx={styles.nameRow(nameIsDragHandle)}
					{...(nameIsDragHandle && dragHandleProps ? dragHandleProps : {})}
				>
					<Avatar src={player.avatar} sx={styles.playerAvatar(player.name)}>
						{helpers.getShortName(player.name)}
					</Avatar>
					<Typography sx={styles.title}>{player.name}</Typography>
					{!readOnly && <EditOutlinedIcon sx={styles.editIcon} />}
				</Stack>
				<Box sx={styles.scoreGrid}>
					<Stack sx={styles.scoreCell} alignItems="flex-start">
						<Typography sx={styles.scoreCaption}>{t('pages.playing.total')}</Typography>
						<Stack direction="row" alignItems="baseline" gap="6px">
							<Typography
								sx={[styles.totalValue(total), ...(flashTotal ? [styles.scoreFlash] : [])]}
							>
								{total}
							</Typography>
							{showTrend && (
								<Stack sx={styles.trendWrapper(increasingTrendValue)}>
									{increasingTrendValue > 0 && <TrendingUpIcon sx={styles.trendIndicator} />}
									{increasingTrendValue === 0 && <RemoveIcon sx={styles.trendIndicator} />}
									{increasingTrendValue < 0 && <TrendingDownIcon sx={styles.trendIndicator} />}
									<Typography sx={styles.trendMetric}>{increasingTrendValue}</Typography>
								</Stack>
							)}
						</Stack>
					</Stack>
					<Stack sx={styles.scoreCell} alignItems="flex-end" data-tour="player-score">
						{readOnly ? (
							<Typography
								sx={[styles.totalValue(currentValue), ...(flashCurrent ? [styles.scoreFlash] : [])]}
							>
								{currentValue}
							</Typography>
						) : (
							<InputScore
								disabled={isFinished || !!player.autoFill}
								value={currentValue}
								onChange={handleScoreChange}
								gap={effectiveGap}
							/>
						)}
					</Stack>
				</Box>
				{!isFinished && !readOnly && (
					<Box sx={styles.scoreGrid}>
						<Stack sx={styles.scoreCell} alignItems="flex-start">
							<Stack
								direction="row"
								alignItems="center"
								onClick={handleOpenGapPopover}
								sx={styles.gapBadge(hasCustomGap)}
								data-tour="player-gap"
							>
								<SpeedIcon sx={{ fontSize: '14px' }} />
								<Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>
									{effectiveGap}
								</Typography>
							</Stack>
						</Stack>
						<Stack sx={styles.scoreCell} alignItems="flex-end">
							<FormControlLabel
								data-tour="player-autofill"
								control={
									<Checkbox
										checked={!!player.autoFill}
										onChange={() => onToggleAutoFill(player.id)}
										size="small"
										sx={{ p: '2px' }}
									/>
								}
								label={
									<Typography sx={{ fontSize: '13px' }}>{t('common.buttons.autoFill')}</Typography>
								}
								sx={{ m: 0 }}
							/>
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
									<Typography onClick={handleResetGap} sx={styles.resetGap}>
										{t('pages.playing.resetToGlobal')}
									</Typography>
								)}
							</Stack>
						</Popover>
					</Box>
				)}
			</Stack>
			{showDragHandle && (
				<Box {...dragHandleProps} sx={styles.dragHandle}>
					<DragIndicatorIcon sx={styles.dragIcon} />
				</Box>
			)}
		</Stack>
	);
}

export default Player;
