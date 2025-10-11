import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useTranslation } from 'react-i18next';
import helpers from '@/utils/helpers';

function useFormatCurrency() {
	const settingValue = useAppSelector((state: RootState) => state.setting);
	const { i18n, t } = useTranslation();

	const formatCurrency = (value: number): string => {
		return helpers.formatCurrencyWithSymbol(value, settingValue.unit, i18n.language, t);
	};

	return { formatCurrency };
}

export default useFormatCurrency;
