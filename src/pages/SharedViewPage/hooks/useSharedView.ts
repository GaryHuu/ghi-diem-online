import { useShareSocket } from '@/hooks';
import { useAppDispatch } from '@/redux/hooks';
import { updateIsShowResult, updateMatchDetail } from '@/redux/slices/matchSlice';
import { matchService } from '@/services';
import { saveSharedHistory } from '@/utils/helpers';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function useSharedView() {
	const { token } = useParams();
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		if (!token) {
			setHasError(true);
			setIsLoading(false);
			return;
		}

		let isActive = true;

		matchService
			.getShared(token)
			.then((match) => {
				if (!isActive) return;
				const total = match.players.find(Boolean)?.scores.length || 1;
				dispatch(updateMatchDetail({ current: total, total, data: match }));
				if (match.isFinished) dispatch(updateIsShowResult(true));
				saveSharedHistory(token, match.name);
				setIsLoading(false);
			})
			.catch(() => {
				if (!isActive) return;
				setHasError(true);
				setIsLoading(false);
			});

		return () => {
			isActive = false;
		};
	}, [token, dispatch]);

	useShareSocket(token);

	return { isLoading, hasError };
}

export default useSharedView;
