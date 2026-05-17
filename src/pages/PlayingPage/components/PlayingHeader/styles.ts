import { SxProps, Theme } from '@mui/material';

const styles = {
	wrapper: (theme: Theme) => ({
		padding: '12px 1rem',
		borderBottom: `2px solid ${theme.palette.divider}`,
		position: 'fixed' as const,
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: theme.palette.background.paper,
		zIndex: 2,
	}),
	matchTitle: {
		fontWeight: 'bold',
		fontSize: '15px',
	} as SxProps,
	p0: {
		padding: 0,
	} as SxProps,
	gameNumber: {
		fontSize: '14px',
		fontWeight: 'bold',
	} as SxProps,
	next: {
		fontSize: '13px',
		fontWeight: 'bold',
	} as SxProps,
	f13Bold: {
		fontSize: '13px',
		fontWeight: 'bold',
	} as SxProps,
	moveToLast: {
		fontSize: '14px',
		fontWeight: 'bold',
		cursor: 'pointer',
	} as SxProps,
};

export default styles;
