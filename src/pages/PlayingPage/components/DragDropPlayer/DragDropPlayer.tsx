import { Player as PlayerType } from '@/utils/types';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDraggablePlayer, usePlaying } from '../../hooks';

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

export default DragDropPlayer;
