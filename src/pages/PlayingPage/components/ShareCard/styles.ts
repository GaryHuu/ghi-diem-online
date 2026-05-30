import { SxProps } from '@mui/material';

const styles = {
	content: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: 320,
	} as SxProps,
	preview: {
		maxWidth: '100%',
		height: 'auto',
		display: 'block',
	} as SxProps,
	loading: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: 280,
	} as SxProps,
};

export default styles;
