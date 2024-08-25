import { PRIMARY_COLOR } from '@/utils/constants';
import helpers from '@/utils/helpers';
import { SxProps } from '@mui/material';

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
	leaderBoardPlayers: {
		padding: '1rem',
		borderTopRightRadius: '1.5rem',
		borderTopLeftRadius: '1.5rem',
		backgroundColor: '#DCEEFF',
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		gap: '0.5rem',
	} as SxProps,
	player: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '12px 16px',
		borderRadius: '1rem',
		backgroundColor: '#FFF',
		border: `1px solid ${PRIMARY_COLOR}`,
	} as SxProps,
	playerLeftInfo: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		gap: '8px',
	} as SxProps,
	playerAvatar: (name: string) =>
		({
			bgcolor: helpers.stringToColor(name),
			border: `1px dashed ${PRIMARY_COLOR}`,
		}) as SxProps,
	playerName: {
		fontWeight: '500',
	} as SxProps,
	score: {
		fontWeight: 400,
		fontStyle: 'italic',
	} as SxProps,
	top: {
		backgroundColor: '#3E9FFF',
		width: '22px',
		height: '22px',
		borderRadius: '50%',
		color: '#FFF',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	} as SxProps,
};

export default styles;
