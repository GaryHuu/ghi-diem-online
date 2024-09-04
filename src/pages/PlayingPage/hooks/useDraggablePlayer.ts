import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { matchService } from '@/services';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';

export type OnDragEndResponder = (result: DropResult, provided: ResponderProvided) => void;

function useDraggablePlayer() {
	const match = useAppSelector((state: RootState) => state.match.matchDetail);
	const dispatch = useAppDispatch();
	const matchId = match?.data.id as number;
	const players = match?.data.players ?? [];

	const onDragEnd = (result: {
		source: { index: number };
		draggableId: string;
		destination: { index: number };
	}) => {
		try {
			if (!match) {
				return;
			}

			// TODO: dispatch action to redux store,  call to service to update db
			const sourcePlayer = players.find(
				(player, index) => player.id === Number.parseInt(result.draggableId),
			);

			const clonePlayers = [...players];

			// remove source item outo list
			clonePlayers.splice(result.source.index, 1);

			// insert source to destination index
			clonePlayers.splice(result.destination.index, 0, sourcePlayer!);

			const newMatch = matchService.get(matchId);
		} catch (e) {}
	};

	return { players, onDragEnd };
}
export default useDraggablePlayer;
