import settingDB from '@/db/setting';
import { Setting } from '@/utils/types';

const settingService = {
	get: () => {
		return settingDB.get();
	},
	update: (data: Setting) => {
		return settingDB.update(data);
	},
};

export default settingService;
