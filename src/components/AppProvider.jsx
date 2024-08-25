import { DEFAULT_SETTING_VALUES } from '@/utils/constants';
import db from '@/db';
import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

export const AppContext = createContext(DEFAULT_SETTING_VALUES);

function AppProvider({ children }) {
	const [settingValue, setSettingValue] = useState(db.getSetting());

	const handleSettingChange = (newValue) => {
		setSettingValue(newValue);
		db.saveSetting(newValue);
	};

	return (
		<AppContext.Provider
			value={{
				value: settingValue,
				onChange: handleSettingChange,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

AppProvider.propTypes = {
	children: PropTypes.node,
};

export default AppProvider;
