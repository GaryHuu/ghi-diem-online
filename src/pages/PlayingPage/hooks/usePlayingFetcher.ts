import { useAddQueryParams } from '@/hooks';
import { useAppDispatch } from '@/redux/hooks';
import { updateIsShowResult, updateMatchDetail } from '@/redux/slices/matchSlice';
import { ROUTES } from '@/routes/constants';
import { matchService } from '@/services';
import helpers from '@/utils/helpers';
import { ErrorType } from '@/utils/types';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function usePlayingFetcher() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const { params } = useAddQueryParams();

	const fetchMatch = useCallback(() => {
		try {
			if (!id) throw new Error('Không tìm thấy trận đấu');

			const newMatch = matchService.get(+id);
			const totalGameNumber = matchService.getCurrentGameNumber(+id);
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
			toast.error(helpers.getErrorMessage(error as ErrorType));
			navigate(ROUTES.HOME);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	useEffect(() => {
		fetchMatch();
	}, [fetchMatch]);

	return null;
}

export default usePlayingFetcher;
