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
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '4px',
	},
};

export default styles;
