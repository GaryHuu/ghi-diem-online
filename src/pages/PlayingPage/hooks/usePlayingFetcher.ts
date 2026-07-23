import { useAddQueryParams } from '@/hooks';
import { useAppDispatch } from '@/redux/hooks';
import { updateIsShowResult, updateMatchDetail } from '@/redux/slices/matchSlice';
import { ROUTES } from '@/routes/constants';
import { matchService } from '@/services';
import { translateError } from '@/utils/helpers';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function usePlayingFetcher() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const { params } = useAddQueryParams();
	const { t } = useTranslation();

	const fetchMatch = useCallback(async () => {
		try {
			if (!id) throw new Error('errors.match.notFound');

			const newMatch = await matchService.get(+id);
			const totalGameNumber = newMatch.players.find(Boolean)?.scores.length || 1;
			const gameNumberParam = params.get('gN');
			const current = gameNumberParam ? +gameNumberParam : totalGameNumber;
			const payload = {
				current,
				total: totalGameNumber,
				data: newMatch,
			};
			dispatch(updateMatchDetail(payload));
			newMatch.isFinished && dispatch(updateIsShowResult(true));
		} catch (error) {
			toast.error(translateError(error, t));
			navigate(ROUTES.HOME);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, t]);

	useEffect(() => {
		fetchMatch();
	}, [fetchMatch]);

	return null;
}

export default usePlayingFetcher;
