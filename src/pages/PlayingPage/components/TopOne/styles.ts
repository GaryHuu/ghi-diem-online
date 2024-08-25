import { PRIMARY_COLOR } from '@/utils/constants';
import helpers from '@/utils/helpers';
import { SxProps } from '@mui/material';

const styles = {
	wrapper: {
		display: 'flex',
		justifyContent: 'center',
		mt: '1.5rem',
	} as SxProps,
	avatarWrapper: {
		position: 'relative',
	} as SxProps,
	avatar: (name: string) =>
		({
			bgcolor: helpers.stringToColor(name),
			width: 80,
			height: 80,
			border: `2px solid ${PRIMARY_COLOR}`,
		}) as SxProps,
	iconCrown: {
		position: 'absolute',
		top: '0px',
		left: '50%',
		transform: 'translate(-50%, -60%)',
		zIndex: '10',
		width: '40px',
	} as SxProps,
	topNumber: {
		position: 'absolute',
		top: '100%',
		left: '50%',
		transform: 'translate(-50%, -60%)',
		backgroundColor: PRIMARY_COLOR,
		width: '22px',
		height: '22px',
		borderRadius: '50%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		color: '#FFF',
	} as SxProps,
	name: {
		mt: '10px',
		textAlign: 'center',
		fontWeight: 500,
	} as SxProps,
	score: { textAlign: 'center', fontWeight: 400, fontStyle: 'italic' } as SxProps,
};

export default styles;
