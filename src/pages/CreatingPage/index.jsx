import db from '@/db';
import { ROUTES } from '@/routes/constants';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

const MIN_LENGTH = 2;
const MAX_LENGTH = 16;

function CreatingPage() {
	const [name, setName] = useState('');
	const [isDirty, setIsDirty] = useState(false);
	const navigate = useNavigate();

	const invalid = name.trim().length < MIN_LENGTH || name.trim().length > MAX_LENGTH;

	const isError = invalid && isDirty;

	const helperText = isError ? `Vui lòng nhập từ ${MIN_LENGTH} đến ${MAX_LENGTH} kí tự` : '';

	const handleNameChange = (event) => {
		if (event.target.value.length <= MAX_LENGTH) {
			setName(event.target.value);
		}
	};

	const handleSubmit = () => {
		if (invalid) {
			setIsDirty(true);
			return;
		}

		const newMatch = db.createNewMatch(name);

		if (newMatch) {
			const path = generatePath(ROUTES.MATCH, { id: newMatch.id });

			navigate(path);
		}
	};

	return (
		<>
			<Stack p={2} height="100%" justifyContent="center" alignItems="center" spacing={2}>
				<TextField
					error={isError}
					label="Tên trận đấu"
					id="name-of-the-match"
					size="medium"
					value={name}
					onChange={handleNameChange}
					onBlur={() => setIsDirty(true)}
					sx={{ width: '100%' }}
					helperText={helperText}
				/>
				<Button variant="contained" size="large" disabled={isError} onClick={handleSubmit}>
					Chơi
				</Button>
			</Stack>
		</>
	);
}

export default CreatingPage;
