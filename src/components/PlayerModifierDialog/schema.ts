import { PLAYER_NAME } from '@/utils/constants';
import * as yup from 'yup';
import i18n from '@/i18n';

export const schema = yup.object().shape({
	name: yup
		.string()
		.trim()
		.min(
			PLAYER_NAME.MIN_LENGTH,
			i18n.t('validation.playerName.length', {
				min: PLAYER_NAME.MIN_LENGTH,
				max: PLAYER_NAME.MAX_LENGTH,
			}),
		)
		.max(
			PLAYER_NAME.MAX_LENGTH,
			i18n.t('validation.playerName.length', {
				min: PLAYER_NAME.MIN_LENGTH,
				max: PLAYER_NAME.MAX_LENGTH,
			}),
		)
		.required(i18n.t('validation.playerName.required')),
});
