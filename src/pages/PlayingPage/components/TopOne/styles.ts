import helpers from '@/utils/helpers';
import { SxProps, Theme } from '@mui/material';

const styles = {
	wrapper: {
		display: 'flex',
		justifyContent: 'center',
		mt: '1.5rem',
	} as SxProps,
	avatarWrapper: {
		position: 'relative',
	} as SxProps,
	avatar: (name: string) => (theme: Theme) => ({
		bgcolor: helpers.stringToColor(name),
		width: 80,
		height: 80,
		border: `2px solid ${theme.palette.primary.main}`,
	}),
	iconCrown: (theme: Theme) => ({
		position: 'absolute' as const,
		top: '0px',
		left: '50%',
		transform: 'translate(-50%, -60%)',
		zIndex: 10,
		width: '40px',
		height: '40px',
		color: theme.palette.primary.main,
	}),
	topNumber: (theme: Theme) => ({
		position: 'absolute' as const,
		top: '100%',
		left: '50%',
		transform: 'translate(-50%, -60%)',
		backgroundColor: theme.palette.primary.main,
		width: '22px',
		height: '22px',
		borderRadius: '50%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		color: theme.palette.primary.contrastText,
	}),
	name: {
		mt: '10px',
		textAlign: 'center',
		fontWeight: 500,
	} as SxProps,
	score: { textAlign: 'center', fontWeight: 400, fontStyle: 'italic' } as SxProps,
};

export default styles;
