import { MATCH_NAME } from '@/utils/constants';
import * as yup from 'yup';
import i18n from '@/i18n';

export const schema = yup
	.object({
		name: yup
			.string()
			.trim()
			.min(
				MATCH_NAME.MIN_LENGTH,
				i18n.t('validation.matchName.minLength', { min: MATCH_NAME.MIN_LENGTH }),
			)
			.max(
				MATCH_NAME.MAX_LENGTH,
				i18n.t('validation.matchName.maxLength', { max: MATCH_NAME.MAX_LENGTH }),
			)
			.required(i18n.t('validation.matchName.required')),
	})
	.required();
