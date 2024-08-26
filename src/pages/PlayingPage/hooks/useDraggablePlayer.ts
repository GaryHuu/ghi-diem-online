import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

function useDraggablePlayer() {
	const match = useAppSelector((state: RootState) => state.match.matchDetail);
	const players = match?.data.players ?? [];

	const onDragEnd = (result: unknown) => {
		// TODO: dispatch action to redux store,  call to service to update db
	};

	return { players, onDragEnd };
}
export default useDraggablePlayer;
