import { SxProps } from '@mui/material';

const styles: { [key: string]: SxProps } = {
	dialogContent: {
		padding: '0',
		maxHeight: '65vh',
	},
	list: {
		pt: 0,
	},
	empty: {
		textAlign: 'center',
		fontSize: '14px',
		fontStyle: 'italic',
		mb: '1rem',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '4px',
	},
};

export default styles;
