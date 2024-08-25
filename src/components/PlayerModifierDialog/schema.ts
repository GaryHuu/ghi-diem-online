import { PLAYER_NAME } from '@/utils/constants';
import * as yup from 'yup';

export const schema = yup.object().shape({
	name: yup
		.string()
		.trim()
		.min(
			PLAYER_NAME.MIN_LENGTH,
			`Vui lòng nhập từ ${PLAYER_NAME.MIN_LENGTH} đến ${PLAYER_NAME.MAX_LENGTH} kí tự`,
		)
		.max(
			PLAYER_NAME.MAX_LENGTH,
			`Vui lòng nhập từ ${PLAYER_NAME.MIN_LENGTH} đến ${PLAYER_NAME.MAX_LENGTH} kí tự`,
		)
		.required('Tên người chơi là bắt buộc'),
});
