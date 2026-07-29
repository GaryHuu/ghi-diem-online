import {
	ADMIN_TOKEN_KEY,
	AdminAuthError,
	AdminMatchSummary,
	adminDeleteMatch,
	adminGetMatch,
	adminGetMatches,
	adminLogin,
	adminRestoreMatch,
} from '@/api';
import { useAppDispatch } from '@/redux/hooks';
import { updateIsShowResult, updateMatchDetail } from '@/redux/slices/matchSlice';
import { ROUTES } from '@/routes/constants';
import { translateError } from '@/utils/helpers';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

type View = 'login' | 'list' | 'detail';

function useDashboard() {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	// The match id lives in the URL (/dashboard/:id) so a reload keeps the
	// detail view instead of dropping back to the list.
	const { id } = useParams();
	const selectedId = id ? Number(id) : null;
	const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [matches, setMatches] = useState<AdminMatchSummary[]>([]);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
	const [rowCount, setRowCount] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoadingList, setIsLoadingList] = useState(false);
	// Which match is in the redux store. Comparing it to the URL id covers both
	// "still loading" and "showing the previous match" in one check.
	const [loadedDetailId, setLoadedDetailId] = useState<number | null>(null);

	const view: View = !token ? 'login' : selectedId ? 'detail' : 'list';
	const isDetailReady = selectedId !== null && loadedDetailId === selectedId;

	const clearSession = useCallback(() => {
		localStorage.removeItem(ADMIN_TOKEN_KEY);
		setToken(null);
		setMatches([]);
		setLoadedDetailId(null);
	}, []);

	const loadMatches = useCallback(() => {
		setIsLoadingList(true);
		adminGetMatches(paginationModel.page, paginationModel.pageSize)
			.then(({ items, count }) => {
				setMatches(items);
				setRowCount(count);
			})
			.catch((error) => {
				if (error instanceof AdminAuthError) clearSession();
				toast.error(translateError(error, t));
			})
			.finally(() => setIsLoadingList(false));
	}, [clearSession, t, paginationModel]);

	// The list is only needed when no match is selected; a detail URL fetches
	// its match directly.
	useEffect(() => {
		if (token && !selectedId) loadMatches();
	}, [token, selectedId, loadMatches]);

	// Loads the match named by the URL, on first paint and after a reload.
	useEffect(() => {
		if (!token || !selectedId) return;

		let isStale = false;
		adminGetMatch(selectedId)
			.then((detail) => {
				if (isStale) return;
				dispatch(updateMatchDetail({ current: detail.total, total: detail.total, data: detail }));
				dispatch(updateIsShowResult(!!detail.isFinished));
				setLoadedDetailId(selectedId);
			})
			.catch((error) => {
				if (isStale) return;
				if (error instanceof AdminAuthError) clearSession();
				toast.error(translateError(error, t));
				navigate(ROUTES.DASHBOARD, { replace: true });
			});

		return () => {
			isStale = true;
		};
	}, [token, selectedId, clearSession, dispatch, navigate, t]);

	const login = () => {
		setIsSubmitting(true);
		adminLogin(username, password)
			.then((newToken) => {
				localStorage.setItem(ADMIN_TOKEN_KEY, newToken);
				setPassword('');
				setToken(newToken);
			})
			.catch((error) => toast.error(translateError(error, t)))
			.finally(() => setIsSubmitting(false));
	};

	const logout = () => clearSession();

	const openMatch = (matchId: number) => navigate(`${ROUTES.DASHBOARD}/${matchId}`);

	const backToList = () => navigate(ROUTES.DASHBOARD);

	/** Soft delete or restore a match, then refresh the row from the response. */
	const setMatchDeleted = (matchId: number, isDeleted: boolean) => {
		const action = isDeleted ? adminDeleteMatch : adminRestoreMatch;
		action(matchId)
			.then((updated) => {
				setMatches((current) => current.map((m) => (m.id === updated.id ? updated : m)));
				toast.success(
					t(isDeleted ? 'pages.dashboard.deleteSuccess' : 'pages.dashboard.restoreSuccess'),
				);
			})
			.catch((error) => {
				if (error instanceof AdminAuthError) clearSession();
				toast.error(translateError(error, t));
			});
	};

	return {
		view,
		username,
		password,
		matches,
		paginationModel,
		rowCount,
		setPaginationModel,
		isSubmitting,
		isLoadingList,
		isDetailReady,
		setUsername,
		setPassword,
		login,
		logout,
		openMatch,
		backToList,
		setMatchDeleted,
	};
}

export default useDashboard;
