import { MATCH_NAME } from '@/utils/constants';
import * as yup from 'yup';

export const schema = yup
	.object({
		name: yup
			.string()
			.trim()
			.min(MATCH_NAME.MIN_LENGTH, `Vui lòng nhập ít nhất ${MATCH_NAME.MIN_LENGTH} kí tự`)
			.max(MATCH_NAME.MAX_LENGTH, `Vui lòng nhập không quá ${MATCH_NAME.MAX_LENGTH} kí tự`)
			.required('Tên trận đấu là bắt buộc'),
	})
	.required();
