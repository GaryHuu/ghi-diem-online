import { ApiError } from '@/api';
import { useShareSocket } from '@/hooks';
import { useAppDispatch } from '@/redux/hooks';
import { updateIsShowResult, updateMatchDetail } from '@/redux/slices/matchSlice';
import { ROUTES } from '@/routes/constants';
import { matchService } from '@/services';
import { removeSharedHistory, saveSharedHistory, translateError } from '@/utils/helpers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function useSharedView() {
	const { token } = useParams();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
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
			.catch((error) => {
				if (!isActive) return;
				// The match is gone (an admin deleted it, or the token is dead):
				// drop the stale history entry and send the viewer home.
				if (error instanceof ApiError && error.status === 404) {
					removeSharedHistory(token);
					toast.error(translateError(error, t));
					// Replace so the back button does not lead into the dead link.
					navigate(ROUTES.HOME, { replace: true });
					return;
				}
				setHasError(true);
				setIsLoading(false);
			});

		return () => {
			isActive = false;
		};
	}, [token, dispatch, navigate, t]);

	useShareSocket(token);

	return { isLoading, hasError };
}

export default useSharedView;
