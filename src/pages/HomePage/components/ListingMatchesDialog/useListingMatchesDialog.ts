import type { ConfirmModalRef } from '@/components/ConfirmModal/ConfirmModal';
import { useBoolean } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMatches } from '@/redux/slices/matchSlice';
import { RootState } from '@/redux/store';
import { ROUTES } from '@/routes/constants';
import { matchService } from '@/services';
import { getSharedHistory, removeSharedHistory } from '@/utils/helpers';
import { useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

function useListingMatchesDialog() {
	const { value: isOpen, setTrue: openDialog, setFalse: onClose } = useBoolean(false);
	const confirmActionRef = useRef<ConfirmModalRef>(null);
	const matches = useAppSelector((state: RootState) => state.match.matches);
	const [sharedMatches, setSharedMatches] = useState(getSharedHistory);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const onOpen = () => {
		setSharedMatches(getSharedHistory());
		openDialog();
	};

	const onItemClick = (id: number) => {
		onClose();
		const path = generatePath(ROUTES.MATCH, { id });
		navigate(path);
	};

	const onSharedItemClick = (token: string) => {
		onClose();
		navigate(generatePath(ROUTES.SHARE, { token }));
	};

	const onDeleteSharedItem = (token: string) => {
		setSharedMatches(removeSharedHistory(token));
	};

	const onDeleteItem = (id: number) => {
		confirmActionRef.current?.confirm(async () => {
			await matchService.delete(id);
			dispatch(fetchMatches());
		});
	};

	const inProgressMatches = matches.filter((match) => !match.isFinished);

	const finishedMatches = matches.filter((match) => match.isFinished);

	return {
		isOpen,
		onOpen,
		onClose,
		matches,
		finishedMatches,
		inProgressMatches,
		sharedMatches,
		onItemClick,
		onDeleteItem,
		onSharedItemClick,
		onDeleteSharedItem,
		confirmActionRef,
	};
}

export default useListingMatchesDialog;
