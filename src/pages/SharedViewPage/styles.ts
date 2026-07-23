import { SxProps, Theme, alpha } from '@mui/material';

const styles: Record<string, SxProps<Theme>> = {
	stateWrapper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '12px',
		minHeight: '60vh',
	},
	header: (theme: Theme) => ({
		position: 'sticky',
		top: 0,
		zIndex: 2,
		padding: '12px 1rem',
		backgroundColor: theme.palette.background.paper,
		borderBottom: `1px solid ${theme.palette.divider}`,
	}),
	matchTitle: {
		fontSize: '16px',
		fontWeight: 'bold',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	p0: {
		padding: 0,
	},
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
	},
	liveBadge: (theme: Theme) => ({
		fontSize: '12px',
		fontWeight: 'bold',
		color: theme.palette.primary.main,
	}),
	players: {
		display: 'flex',
		flexDirection: 'column',
		padding: '12px 1rem',
		gap: '8px',
	},
};

export default styles;
