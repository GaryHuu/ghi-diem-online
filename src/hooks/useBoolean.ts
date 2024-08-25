import { useCallback, useState } from 'react';

function useBoolean(defaultValue = false) {
	const [value, setValue] = useState(defaultValue);
	const setTrue = useCallback(() => setValue(true), []);
	const setFalse = useCallback(() => setValue(false), []);
	const toggle = useCallback(() => setValue((prevValue) => !prevValue), []);

	return {
		value,
		setTrue,
		setFalse,
		toggle,
	};
}
export default useBoolean;
