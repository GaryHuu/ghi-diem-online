import { useAppDispatch } from '@/redux/hooks';
import { updateMatches } from '@/redux/slices/matchSlice';
import { ROUTES } from '@/routes/constants';
import { matchService } from '@/services';
import helpers from '@/utils/helpers';
import { ErrorType } from '@/utils/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { generatePath, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreatingPageForm, schema } from '../utils';

function useCreatingPage() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const { register, handleSubmit, formState } = useForm<CreatingPageForm>({
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: CreatingPageForm) => {
		try {
			const newMatch = matchService.create(data.name);
			const newMatches = matchService.getAll();

			dispatch(updateMatches(newMatches));

			const path = generatePath(ROUTES.MATCH, { id: newMatch.id });
			navigate(path);
		} catch (error) {
			toast.error(helpers.getErrorMessage(error as ErrorType));
		}
	};

	return {
		formState,
		register,
		onSubmit: handleSubmit(onSubmit),
	};
}

export default useCreatingPage;
