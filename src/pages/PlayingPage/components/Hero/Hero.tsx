import { PlayerModifierDialog } from '@/components';
import { PlayerModifierDialogRefType } from '@/components/PlayerModifierDialog/PlayerModifierDialog';
import { Player as PlayerType } from '@/utils/types';
import { Add as AddIcon } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { useRef } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDraggablePlayer, usePlaying } from '../../hooks';
import EmptyPlayerMessage from '../EmptyPlayerMessage';
import LeaderBoard from '../LeaderBoard';
import Player from '../Player';
import styles from './styles';

type DragDropPlayerProps = {
	children: (props: { player: PlayerType }) => React.ReactNode;
};

const DragDropPlayer = ({ children }: DragDropPlayerProps) => {
	const { players, onDragEnd } = useDraggablePlayer();

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppable">
				{(provider, snapshot) => {
					return (
						<div {...provider.innerRef} ref={provider.innerRef}>
							{players.map((player, index) => (
								<Draggable key={player.id} draggableId={player.id.toString()} index={index}>
									{(provider, snapshot) => (
										<div
											ref={provider.innerRef}
											{...provider.draggableProps}
											{...provider.dragHandleProps}
										>
											{children({ player })}
										</div>
									)}
								</Draggable>
							))}
						</div>
					);
				}}
			</Droppable>
		</DragDropContext>
	);
};

function Hero() {
	const { isEmptyPlayer, isFinished, match, onAdjustPlayer } = usePlaying();
	const playerModifierDialogRef = useRef<PlayerModifierDialogRefType>(null);

	const onRenamePlayer = (player: PlayerType) => {
		if (isFinished) return;
		playerModifierDialogRef.current?.editPlayerName(player);
	};

	const isAllowedAddPlayer = !isFinished && match?.current === match?.total;

	return (
		<>
			<LeaderBoard />
			<Stack sx={styles.wrapper}>
				<Stack sx={styles.content}>
					{isEmptyPlayer && <EmptyPlayerMessage />}
					<DragDropPlayer>
						{({ player }) => <Player key={player.id} player={player} onRename={onRenamePlayer} />}
					</DragDropPlayer>
					{isAllowedAddPlayer && (
						<PlayerModifierDialog ref={playerModifierDialogRef} onSubmit={onAdjustPlayer}>
							<Button variant="contained" size="large" startIcon={<AddIcon />} />
						</PlayerModifierDialog>
					)}
				</Stack>
			</Stack>
		</>
	);
}

export default Hero;
