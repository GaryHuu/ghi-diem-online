export const getValueOnBlurByText = (value = '') => {
	if (!value || value === '-' || value === '+') {
		return 0;
	}
	return +value;
};
