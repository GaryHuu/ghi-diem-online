import helpers from '@/utils/helpers';
import { alpha, SxProps, Theme } from '@mui/material';

const styles = {
	wrapper: (autoFill?: boolean) => (theme: Theme) => ({
		padding: '8px 12px',
		gap: '4px',
		border: `1px solid ${theme.palette.primary.main}`,
		borderRadius: '0.5rem',
		backgroundColor: autoFill
			? alpha(theme.palette.primary.main, 0.12)
			: theme.palette.background.paper,
		flex: 1,
	}),
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	} as SxProps,
	playerAvatar: (name: string) =>
		({
			width: 36,
			height: 36,
			fontSize: '0.85rem',
			bgcolor: helpers.stringToColor(name),
		}) as SxProps,
	title: (theme: Theme) => ({
		whiteSpace: 'nowrap' as const,
		fontWeight: 'bold',
		fontSize: '15px',
		userSelect: 'none' as const,
		textDecoration: 'underline dotted',
		textDecorationColor: theme.palette.action.disabled,
		textUnderlineOffset: '3px',
	}),
	scoreWrapper: {
		flexDirection: 'row',
		gap: '0.25rem',
	} as SxProps,
	score: (total: number) => (theme: Theme) => ({
		fontWeight: 'bold',
		fontSize: '14px',
		color:
			total >= 0
				? total === 0
					? theme.palette.primary.main
					: theme.palette.success.main
				: theme.palette.error.main,
	}),
	trendWrapper: (increasingTrendValue: number) => (theme: Theme) => ({
		flexDirection: 'row',
		alignItems: 'center',
		color:
			increasingTrendValue > 0
				? theme.palette.success.main
				: increasingTrendValue < 0
					? theme.palette.error.main
					: theme.palette.text.secondary,
		fontSize: '14px',
	}),
	trendIndicator: {
		height: '16px',
		marginLeft: '-4px',
	} as SxProps,
	trendMetric: {
		fontWeight: 'bold',
		fontSize: '14px',
	} as SxProps,
	gapBadge: (hasCustomGap: boolean) => (theme: Theme) => ({
		cursor: 'pointer',
		gap: '2px',
		padding: '1px 6px',
		borderRadius: '12px',
		border: `1px solid ${hasCustomGap ? theme.palette.primary.main : theme.palette.action.disabled}`,
		backgroundColor: hasCustomGap ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
		color: hasCustomGap ? theme.palette.primary.main : theme.palette.text.secondary,
		userSelect: 'none' as const,
	}),
	resetGap: (theme: Theme) => ({
		fontSize: '12px',
		color: theme.palette.primary.main,
		cursor: 'pointer',
		textAlign: 'center' as const,
		mt: '4px',
		textDecoration: 'underline',
		textUnderlineOffset: '2px',
		'&:hover': {
			color: theme.palette.primary.dark,
		},
	}),
	dragHandle: (theme: Theme) => ({
		display: 'flex',
		alignItems: 'center',
		cursor: 'grab',
		color: theme.palette.text.secondary,
		touchAction: 'none',
		'&:active': {
			cursor: 'grabbing',
		},
	}),
	dragIcon: {
		fontSize: '20px',
	} as SxProps,
};

export default styles;
