import { SxProps, Theme } from '@mui/material';

const styles = {
	title: {
		fontWeight: 'bold',
		mb: '4px',
	} as SxProps,
	unitItem: (active: boolean) => (theme: Theme) => ({
		cursor: 'pointer',
		minWidth: '100px',
		border: `1px solid ${theme.palette.primary.main}`,
		borderRadius: '4px',
		padding: '6px 8px',
		textAlign: 'center' as const,
		color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
		backgroundColor: active ? theme.palette.primary.main : 'transparent',
	}),
	copyright: (theme: Theme) => ({
		fontSize: '14px',
		color: theme.palette.text.secondary,
	}),
};

export default styles;
