import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateMatchDetailData } from '@/redux/slices/matchSlice';
import { RootState } from '@/redux/store';
import { matchService } from '@/services';
import { DropResult, ResponderProvided, DraggableLocation } from 'react-beautiful-dnd';

export type OnDragEndResponder = (result: DropResult, provided: ResponderProvided) => void;

function useDraggablePlayer() {
	const match = useAppSelector((state: RootState) => state.match.matchDetail);
	const dispatch = useAppDispatch();
	const matchId = match?.data.id as number;
	const players = match?.data.players ?? [];

	const onDragEnd = (result: DropResult) => {
		console.log('Trigger', result);
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

			if (result.destination) {
				// insert source to destination index
				clonePlayers.splice(result.destination.index, 0, sourcePlayer!);
			}
			matchService.updatePositionOfPlayer(matchId, clonePlayers);
			// Get match Id
			const newMatch = matchService.get(matchId);

			// Update match detail
			dispatch(updateMatchDetailData(newMatch));
		} catch (e) {}
	};

	return { players, onDragEnd };
}
export default useDraggablePlayer;
