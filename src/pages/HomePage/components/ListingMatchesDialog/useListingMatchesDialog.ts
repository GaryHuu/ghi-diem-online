import { useBoolean } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateMatches } from '@/redux/slices/matchSlice';
import { RootState } from '@/redux/store';
import { ROUTES } from '@/routes/constants';
import { matchService } from '@/services';
import { useRef } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

function useListingMatchesDialog() {
	const { value: isOpen, setTrue: onOpen, setFalse: onClose } = useBoolean(false);
	const confirmActionRef = useRef<{ confirm: (callback: () => void) => void }>();
	const matches = useAppSelector((state: RootState) => state.match.matches);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const onItemClick = (id: number) => {
		onClose();
		const path = generatePath(ROUTES.MATCH, { id });
		navigate(path);
	};

	const onDeleteItem = (id: number) => {
		confirmActionRef.current?.confirm(() => {
			matchService.delete(id);
			const newMatch = matchService.getAll();
			dispatch(updateMatches(newMatch));
		});
	};

	return {
		isOpen,
		onOpen,
		onClose,
		matches,
		onItemClick,
		onDeleteItem,
		confirmActionRef,
	};
}

export default useListingMatchesDialog;
