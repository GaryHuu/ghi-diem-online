import { SxProps, Theme } from '@mui/material';

const styles = {
	wrapper: (theme: Theme) => ({
		position: 'fixed' as const,
		bottom: '64px',
		left: 0,
		right: 0,
		padding: '8px 1rem',
		backgroundColor: theme.palette.background.paper,
		zIndex: 3,
	}),
	primaryButton: (theme: Theme) => ({
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
	}),
	primaryLabel: {
		fontSize: '15px',
		fontWeight: 'bold',
	} as SxProps,
};

export default styles;
