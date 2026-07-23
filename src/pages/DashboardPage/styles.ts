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
	loginWrapper: {
		display: 'flex',
		flexDirection: 'column',
		gap: '16px',
		maxWidth: '360px',
		margin: '0 auto',
		padding: '48px 1rem',
	},
	loginTitle: {
		fontSize: '20px',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	listWrapper: {
		padding: '16px 1rem',
	},
	listHeader: {
		marginBottom: '12px',
	},
	listTitle: {
		fontSize: '18px',
		fontWeight: 'bold',
	},
	row: {
		cursor: 'pointer',
	},
	deviceFilter: {
		marginBottom: '12px',
		minWidth: '220px',
	},
	deviceId: {
		fontFamily: 'monospace',
		fontSize: '13px',
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
	roundPill: (theme: Theme) => ({
		display: 'inline-flex',
		alignItems: 'center',
		alignSelf: 'flex-start',
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
	players: {
		display: 'flex',
		flexDirection: 'column',
		padding: '12px 1rem',
		gap: '8px',
	},
};

export default styles;
