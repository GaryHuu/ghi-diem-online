import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton, Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const getValueOnBlurByText = (value = '') => {
	if (!value || value === '-' || value === '+') {
		return 0;
	}

	return +value;
};

function InputScore({ value = 0, onChange = () => {}, gap = 1, disabled = false }) {
	const [currentValue, setCurrentValue] = useState(value);

	const handleInputChange = (e) => {
		const newValue = e.target.value;

		if (!isNaN(newValue) || newValue === '-') {
			setCurrentValue(newValue);
		}
	};

	const handleInputBlur = () => {
		const newValue = getValueOnBlurByText(currentValue);

		onChange(newValue);
		setCurrentValue(newValue);
	};

	const handleDecrease = () => {
		const newValue = getValueOnBlurByText(currentValue);
		onChange(newValue - gap);
	};

	const handleIncrease = () => {
		const newValue = getValueOnBlurByText(currentValue);
		onChange(newValue + gap);
	};

	useEffect(() => {
		setCurrentValue(value);
	}, [value]);

	return (
		<Stack direction="row" alignItems="center">
			<IconButton onClick={handleDecrease} disabled={disabled}>
				<RemoveIcon />
			</IconButton>
			<TextField
				value={currentValue}
				onChange={handleInputChange}
				onBlur={handleInputBlur}
				disabled={disabled}
				sx={{
					flex: 1,
					maxWidth: '100px',
					'.MuiInputBase-input': {
						textAlign: 'center',
					},
				}}
				type="number"
				size="small"
			/>
			<IconButton onClick={handleIncrease} disabled={disabled}>
				<AddIcon />
			</IconButton>
		</Stack>
	);
}

InputScore.propTypes = {
	value: PropTypes.number.isRequired,
	onChange: PropTypes.func,
	gap: PropTypes.number,
	disabled: PropTypes.bool,
};

export default InputScore;
