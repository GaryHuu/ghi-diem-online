import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { VND_SYMBOL } from '@/utils/constants';
import helpers from '@/utils/helpers';

function useFormatCurrency() {
	const settingValue = useAppSelector((state: RootState) => state.setting);

	const formatCurrency = (value: number): string => {
		return helpers.formatCurrency(value * settingValue.unit) + VND_SYMBOL;
	};

	return { formatCurrency };
}

export default useFormatCurrency;
