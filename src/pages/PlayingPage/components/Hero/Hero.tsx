import { PlayerModifierDialog } from '@/components';
import { PlayerModifierDialogRefType } from '@/components/PlayerModifierDialog/PlayerModifierDialog';
import { Player as PlayerType } from '@/utils/types';
import { Add as AddIcon } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { useRef } from 'react';

import { usePlaying } from '../../hooks';
import EmptyPlayerMessage from '../EmptyPlayerMessage';
import LeaderBoard from '../LeaderBoard';
import Player from '../Player';
import styles from './styles';
import DragDropPlayer from '../DragDropPlayer';

function Hero() {
	const { isEmptyPlayer, isFinished, match, onAdjustPlayer } = usePlaying();
	const playerModifierDialogRef = useRef<PlayerModifierDialogRefType>(null);

	const onRenamePlayer = (player: PlayerType) => {
		if (isFinished) return;
		playerModifierDialogRef.current?.editPlayerName(player);
	};

	const isAllowedActionForPlayer = !isFinished && match?.current === match?.total;

	return (
		<>
			<LeaderBoard />
			<Stack sx={styles.wrapper}>
				<Stack sx={styles.content}>
					{isEmptyPlayer && <EmptyPlayerMessage />}
					<DragDropPlayer isAllow={isAllowedActionForPlayer}>
						{(player) => <Player key={player.id} player={player} onRename={onRenamePlayer} />}
					</DragDropPlayer>
					{isAllowedActionForPlayer && (
						<PlayerModifierDialog ref={playerModifierDialogRef} onSubmit={onAdjustPlayer}>
							<Button variant="contained" size="small" startIcon={<AddIcon />} />
						</PlayerModifierDialog>
					)}
				</Stack>
			</Stack>
		</>
	);
}

export default Hero;
