import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateMatchDetailData } from '@/redux/slices/matchSlice';
import { RootState } from '@/redux/store';
import { matchService } from '@/services';
import { translateError } from '@/utils/helpers';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export type OnDragEndResponder = (result: DropResult, provided: ResponderProvided) => void;

function useDraggablePlayer() {
	const { t } = useTranslation();
	const match = useAppSelector((state: RootState) => state.match.matchDetail);
	const dispatch = useAppDispatch();
	const matchId = match?.data.id as number;
	const players = match?.data.players ?? [];

	const onDragEnd: OnDragEndResponder = async (result) => {
		try {
			if (!match) {
				throw new Error(t('errors.match.notFound'));
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

			const newMatch = await matchService.updatePositionOfPlayer(matchId, clonePlayers);
			dispatch(updateMatchDetailData(newMatch));
			toast.success(t('toast.positionChanged'));
		} catch (error) {
			toast.error(translateError(error, t));
		}
	};

	return { players, onDragEnd };
}
export default useDraggablePlayer;
