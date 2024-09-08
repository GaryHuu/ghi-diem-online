import { Player as PlayerType } from '@/utils/types';

import { CSSProperties, ReactNode } from 'react';
import {
	DragDropContext,
	Draggable,
	DraggableProvided,
	Droppable,
	DroppableProvided,
} from 'react-beautiful-dnd';
import { useDraggablePlayer } from '../../hooks';
import styles from './styles';

type DragDropPlayerProps = {
	children: (player: PlayerType) => ReactNode;
	isAllow: boolean;
};

function DragDropPlayer({ children, isAllow }: DragDropPlayerProps) {
	const { players, onDragEnd } = useDraggablePlayer();

	const getDragItemStyle = (style: CSSProperties) => ({
		...style,
		...styles.dragItem,
	});

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="drag-drop-player">
				{(provider: DroppableProvided) => (
					<div ref={provider.innerRef} {...provider.droppableProps} style={styles.provider}>
						{players.map((player, index) => (
							<Draggable
								key={player.id}
								draggableId={player.id.toString()}
								index={index}
								isDragDisabled={!isAllow}
							>
								{(provider: DraggableProvided) => (
									<div
										ref={provider.innerRef}
										{...provider.draggableProps}
										{...provider.dragHandleProps}
										style={getDragItemStyle(provider.draggableProps.style as CSSProperties)}
									>
										{children(player)}
									</div>
								)}
							</Draggable>
						))}
						{provider.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}

export default DragDropPlayer;
