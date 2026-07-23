import { useAppDispatch } from '@/redux/hooks';
import { fetchMatches } from '@/redux/slices/matchSlice';
import { ROUTES } from '@/routes/constants';
import { matchService } from '@/services';
import { translateError } from '@/utils/helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { generatePath, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { CreatingPageForm, schema } from '../utils';

function useCreatingPage() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { t } = useTranslation();

	const { register, handleSubmit, formState } = useForm<CreatingPageForm>({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data: CreatingPageForm) => {
		try {
			const newMatch = await matchService.create(data.name);
			dispatch(fetchMatches());

			const path = generatePath(ROUTES.MATCH, { id: newMatch.id });
			navigate(path);
		} catch (error) {
			toast.error(translateError(error, t));
		}
	};

	return {
		formState,
		register,
		onSubmit: handleSubmit(onSubmit),
	};
}

export default useCreatingPage;
