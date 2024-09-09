import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateMatchDetailData } from '@/redux/slices/matchSlice';
import { RootState } from '@/redux/store';
import { matchService } from '@/services';
import helpers from '@/utils/helpers';
import { ErrorType } from '@/utils/types';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';

export type OnDragEndResponder = (result: DropResult, provided: ResponderProvided) => void;

function useDraggablePlayer() {
	const match = useAppSelector((state: RootState) => state.match.matchDetail);
	const dispatch = useAppDispatch();
	const matchId = match?.data.id as number;
	const players = match?.data.players ?? [];

	const onDragEnd: OnDragEndResponder = (result, provided) => {
		try {
			if (!match) {
				throw new Error('Không tìm thấy trận đấu');
			}

			if (!result.destination || result.destination.index === result.source.index) {
				return;
			}

			const sourcePlayer = players.find((player) => player.id === +result.draggableId);

			if (!sourcePlayer) {
				return;
			}

			const clonePlayers = [...players];
			clonePlayers.splice(result.source.index, 1);
			clonePlayers.splice(result.destination.index, 0, sourcePlayer);

			matchService.updatePositionOfPlayer(matchId, clonePlayers);

			const newMatch = matchService.get(matchId);
			dispatch(updateMatchDetailData(newMatch));
			toast.success('Thay đổi vị trí thành công');
		} catch (error) {
			toast.error(helpers.getErrorMessage(error as ErrorType));
		}
	};

	return { players, onDragEnd };
}
export default useDraggablePlayer;
