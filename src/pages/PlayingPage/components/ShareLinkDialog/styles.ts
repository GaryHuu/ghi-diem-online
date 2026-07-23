import { SxProps, Theme } from '@mui/material';

const styles: Record<string, SxProps<Theme>> = {
	content: {
		display: 'flex',
		flexDirection: 'column',
		gap: '12px',
		minWidth: '260px',
	},
	description: {
		fontSize: '14px',
		color: 'text.secondary',
	},
	loading: {
		display: 'flex',
		justifyContent: 'center',
		py: '16px',
	},
};

export default styles;
