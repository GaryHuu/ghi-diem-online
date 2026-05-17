import helpers from '@/utils/helpers';
import { alpha, SxProps, Theme } from '@mui/material';

const styles = {
	headerWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	} as SxProps,
	p0: {
		padding: 0,
	} as SxProps,
	content: {
		padding: 0,
		gap: '6px',
		display: 'flex',
		flexDirection: 'column',
	} as SxProps,
	leaderBoardPlayers: (theme: Theme) => ({
		padding: '1rem',
		borderTopRightRadius: '1.5rem',
		borderTopLeftRadius: '1.5rem',
		backgroundColor: alpha(theme.palette.primary.main, 0.12),
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		gap: '0.5rem',
	}),
	player: (theme: Theme) => ({
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '12px 16px',
		borderRadius: '1rem',
		backgroundColor: theme.palette.background.paper,
		border: `1px solid ${theme.palette.primary.main}`,
	}),
	playerLeftInfo: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		gap: '8px',
	} as SxProps,
	playerAvatar: (name: string) => (theme: Theme) => ({
		bgcolor: helpers.stringToColor(name),
		border: `1px solid ${theme.palette.primary.main}`,
	}),
	playerName: {
		fontWeight: '500',
	} as SxProps,
	score: {
		fontWeight: 400,
		fontStyle: 'italic',
	} as SxProps,
	top: (theme: Theme) => ({
		backgroundColor: theme.palette.primary.main,
		width: '22px',
		height: '22px',
		borderRadius: '50%',
		color: theme.palette.primary.contrastText,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}),
};

export default styles;
