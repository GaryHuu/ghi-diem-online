import helpers from '@/utils/helpers';
import { SxProps, Theme } from '@mui/material';

const styles = {
	dialogContent: {
		padding: '1.5rem 1rem 1rem',
	} as SxProps,
	input: { width: '100%' } as SxProps,
	actions: { mt: 1.5, flexDirection: 'row', gap: 1, justifyContent: 'flex-end' } as SxProps,
	tip: {
		mt: 1,
		fontSize: '0.8rem',
		fontStyle: 'italic',
	} as SxProps,
	avatarLarge: (name?: string) =>
		({
			width: 72,
			height: 72,
			cursor: 'pointer',
			bgcolor: helpers.stringToColor(name ?? ''),
			fontSize: '1.5rem',
		}) as SxProps,
	avatarBadgeBtn: (theme: Theme) => ({
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		width: 24,
		height: 24,
		'&:hover': { backgroundColor: theme.palette.primary.dark },
	}),
};

export default styles;
