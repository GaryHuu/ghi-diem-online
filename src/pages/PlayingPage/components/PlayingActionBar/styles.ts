import { SxProps, Theme } from '@mui/material';

const styles = {
	wrapper: (theme: Theme) => ({
		position: 'fixed' as const,
		bottom: '64px',
		left: 0,
		right: 0,
		padding: '12px 1rem',
		backgroundColor: theme.palette.background.paper,
		zIndex: 3,
	}),
	primaryButton: (theme: Theme) => ({
		// Shares the row evenly with the end-match button.
		flex: 1,
		minWidth: 0,
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
	}),
	// Deliberately the quieter half of the row: neutral colours and less width
	// so the primary action is the one the thumb goes for.
	endButton: (theme: Theme) => ({
		flex: '0 0 40%',
		minWidth: 0,
		whiteSpace: 'nowrap',
		color: theme.palette.text.secondary,
		borderColor: theme.palette.divider,
		'&:hover': {
			borderColor: theme.palette.text.secondary,
			backgroundColor: 'transparent',
		},
	}),
	primaryLabel: {
		fontSize: '15px',
		fontWeight: 'bold',
	} as SxProps,
	endLabel: {
		fontSize: '14px',
	} as SxProps,
};

export default styles;
