import { alpha, SxProps, Theme } from '@mui/material';

const styles = {
	wrapper: (theme: Theme) => ({
		position: 'fixed' as const,
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: theme.palette.background.paper,
		borderBottom: `1px solid ${theme.palette.divider}`,
		zIndex: 2,
	}),
	inner: {
		padding: '12px 1rem 8px',
	} as SxProps,
	matchTitle: {
		fontWeight: 'bold',
		fontSize: '15px',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		minWidth: 0,
	} as SxProps,
	p0: {
		padding: 0,
	} as SxProps,
	roundPill: (theme: Theme) => ({
		display: 'inline-flex',
		alignItems: 'center',
		padding: '2px 10px',
		borderRadius: '999px',
		backgroundColor: alpha(theme.palette.primary.main, 0.12),
		color: theme.palette.primary.main,
	}),
	roundPillText: {
		fontSize: '13px',
		fontWeight: 'bold',
		lineHeight: 1.4,
	} as SxProps,
	progressBar: (theme: Theme) => ({
		height: '3px',
		backgroundColor: alpha(theme.palette.primary.main, 0.12),
		'& .MuiLinearProgress-bar': {
			backgroundColor: theme.palette.primary.main,
		},
	}),
	shareButton: (theme: Theme) => ({
		borderColor: theme.palette.primary.main,
		color: theme.palette.primary.main,
		textTransform: 'none' as const,
		paddingX: '12px',
		whiteSpace: 'nowrap' as const,
		flexShrink: 0,
	}),
	shareLabel: {
		fontSize: '14px',
		fontWeight: 'bold',
	} as SxProps,
};

export default styles;
