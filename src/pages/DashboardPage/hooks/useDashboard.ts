import {
	ADMIN_TOKEN_KEY,
	AdminAuthError,
	AdminMatchSummary,
	adminGetMatch,
	adminGetMatches,
	adminLogin,
} from '@/api';
import { useAppDispatch } from '@/redux/hooks';
import { updateIsShowResult, updateMatchDetail } from '@/redux/slices/matchSlice';
import { translateError } from '@/utils/helpers';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type View = 'login' | 'list' | 'detail';

function useDashboard() {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [matches, setMatches] = useState<AdminMatchSummary[]>([]);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
	const [rowCount, setRowCount] = useState(0);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoadingList, setIsLoadingList] = useState(false);
	const [isLoadingDetail, setIsLoadingDetail] = useState(false);

	const view: View = !token ? 'login' : selectedId ? 'detail' : 'list';

	const clearSession = useCallback(() => {
		localStorage.removeItem(ADMIN_TOKEN_KEY);
		setToken(null);
		setMatches([]);
		setSelectedId(null);
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

	useEffect(() => {
		if (token) loadMatches();
	}, [token, loadMatches]);

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

	const openMatch = (id: number) => {
		setIsLoadingDetail(true);
		adminGetMatch(id)
			.then((detail) => {
				dispatch(
					updateMatchDetail({
						current: detail.total,
						total: detail.total,
						data: detail,
					}),
				);
				dispatch(updateIsShowResult(!!detail.isFinished));
				setSelectedId(id);
			})
			.catch((error) => {
				if (error instanceof AdminAuthError) clearSession();
				toast.error(translateError(error, t));
			})
			.finally(() => setIsLoadingDetail(false));
	};

	const backToList = () => setSelectedId(null);

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
		isLoadingDetail,
		setUsername,
		setPassword,
		login,
		logout,
		openMatch,
		backToList,
	};
}

export default useDashboard;
