import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { IconButton, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { getValueOnBlurByText } from './utils';

type Props = {
	value: number;
	onChange?: (value: number) => void;
	gap?: number;
	disabled?: boolean;
};

function InputScore({ value = 0, onChange = () => {}, gap = 1, disabled = false }: Props) {
	const [currentValue, setCurrentValue] = useState<number | string>(value);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;

		if (!isNaN(+newValue) || newValue === '-') {
			setCurrentValue(newValue);
		}
	};

	const handleInputBlur = () => {
		const newValue = getValueOnBlurByText(currentValue.toString());
		onChange(newValue);
		setCurrentValue(newValue);
	};

	const handleDecrease = () => {
		const newValue = getValueOnBlurByText(currentValue.toString());
		onChange(newValue - gap);
	};

	const handleIncrease = () => {
		const newValue = getValueOnBlurByText(currentValue.toString());
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
				size="small"
				type="number"
				sx={{
					flex: 1,
					maxWidth: '100px',
					'.MuiInputBase-input': {
						textAlign: 'center',
					},
				}}
			/>
			<IconButton onClick={handleIncrease} disabled={disabled}>
				<AddIcon />
			</IconButton>
		</Stack>
	);
}

export default InputScore;
