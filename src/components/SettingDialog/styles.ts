import { SxProps } from '@mui/material';

const styles = {
	title: {
		fontWeight: 'bold',
		mb: '4px',
	} as SxProps,
	unitItem: (active: boolean) =>
		({
			cursor: 'pointer',
			minWidth: '100px',
			border: `1px solid #1976D2`,
			borderRadius: '4px',
			padding: '6px 8px',
			textAlign: 'center',
			color: active ? '#FFF' : '#000',
			backgroundColor: active ? '#1976D2' : 'transparent',
		}) as SxProps,
};

export default styles;
