import { Player as PlayerType } from '@/utils/types';

import {
	DragDropContext,
	Draggable,
	Droppable,
	DroppableProvided,
	DraggableProvided,
} from 'react-beautiful-dnd';
import { useDraggablePlayer, usePlaying } from '../../hooks';

interface DragDropPlayerProps {
	children: ({ player }: { player: PlayerType }) => React.ReactNode;
}

const DragDropPlayer: React.FC<DragDropPlayerProps> = ({ children }) => {
	const { players, onDragEnd } = useDraggablePlayer();

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppable">
				{(provider: DroppableProvided, snapshot) => {
					return (
						<div
							ref={provider.innerRef}
							{...provider.droppableProps}
							style={{ rowGap: 20, display: 'flex', flexDirection: 'column' }}
						>
							{players.map((player, index) => (
								<Draggable key={player.id} draggableId={player.id.toString()} index={index}>
									{(provider: DraggableProvided, snapshot) => (
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
							{provider.placeholder}
						</div>
					);
				}}
			</Droppable>
		</DragDropContext>
	);
};

export default DragDropPlayer;
