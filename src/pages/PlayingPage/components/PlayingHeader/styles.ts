import { SxProps } from '@mui/material';

const styles: { [key: string]: SxProps } = {
	wrapper: {
		padding: '12px 1rem',
		borderBottom: '2px solid #CCC',
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: '#FFF',
		zIndex: 2,
	},
	matchTitle: {
		fontWeight: 'bold',
		fontSize: '15px',
	},
	p0: {
		padding: 0,
	},
	gameNumber: {
		fontSize: '14px',
		fontWeight: 'bold',
	},
	next: {
		fontSize: '13px',
		fontWeight: 'bold',
	},
	f13Bold: {
		fontSize: '13px',
		fontWeight: 'bold',
	},
	moveToLast: {
		fontSize: '14px',
		fontWeight: 'bold',
		cursor: 'pointer',
	},
};

export default styles;
