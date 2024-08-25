import { DB_KEYS, DEFAULT_SETTING_VALUES } from '@/utils/constants';
import { Setting } from '@/utils/types';
import helpers from '@/utils/helpers';

const settingDB = {
	get: (): Setting => {
		const data = helpers.getFromLocalStorage<Setting | null>(DB_KEYS.SETTING, null);

		if (!data) {
			helpers.setToLocalStorage(DB_KEYS.SETTING, DEFAULT_SETTING_VALUES);
			return DEFAULT_SETTING_VALUES;
		}

		return data;
	},
	update: (data: Setting) => {
		helpers.setToLocalStorage(DB_KEYS.SETTING, data);
		return data;
	},
};

export default settingDB;
