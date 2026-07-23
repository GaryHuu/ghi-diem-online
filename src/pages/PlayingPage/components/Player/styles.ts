import helpers from '@/utils/helpers';
import { alpha, SxProps, Theme } from '@mui/material';

const styles = {
	wrapper: (autoFill?: boolean) => (theme: Theme) => ({
		padding: '10px 12px',
		gap: '8px',
		border: `1px solid ${theme.palette.primary.main}`,
		borderRadius: '0.5rem',
		backgroundColor: autoFill
			? alpha(theme.palette.primary.main, 0.12)
			: theme.palette.background.paper,
		flex: 1,
	}),
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
	nameRow: (nameIsDragHandle: boolean) => ({
		cursor: nameIsDragHandle ? ('grab' as const) : ('pointer' as const),
		touchAction: nameIsDragHandle ? ('none' as const) : ('auto' as const),
		userSelect: 'none' as const,
		...(nameIsDragHandle && {
			'&:active': { cursor: 'grabbing' as const },
		}),
	}),
	scoreGrid: {
		display: 'grid',
		gridTemplateColumns: 'minmax(120px, 1fr) 1fr',
		gap: '12px',
		alignItems: 'center',
	} as SxProps,
	scoreCell: {
		gap: '4px',
	} as SxProps,
	scoreCaption: (theme: Theme) => ({
		fontSize: '11px',
		fontWeight: 600,
		textTransform: 'uppercase' as const,
		letterSpacing: '0.04em',
		color: theme.palette.text.secondary,
	}),
	scoreFlash: (theme: Theme) => ({
		borderRadius: '4px',
		padding: '0 4px',
		margin: '0 -4px',
		animation: 'score-flash 1.2s ease-out',
		'@keyframes score-flash': {
			'0%': { backgroundColor: alpha(theme.palette.primary.main, 0.45) },
			'50%': { backgroundColor: alpha(theme.palette.primary.main, 0.25) },
			'100%': { backgroundColor: 'transparent' },
		},
	}),
	totalValue: (total: number) => (theme: Theme) => ({
		fontWeight: 'bold',
		fontSize: '22px',
		lineHeight: 1.1,
		color:
			total >= 0
				? total === 0
					? theme.palette.text.primary
					: theme.palette.success.main
				: theme.palette.error.main,
	}),
	trendWrapper: (increasingTrendValue: number) => (theme: Theme) => ({
		flexDirection: 'row' as const,
		alignItems: 'center',
		color:
			increasingTrendValue > 0
				? theme.palette.success.main
				: increasingTrendValue < 0
					? theme.palette.error.main
					: theme.palette.text.secondary,
		fontSize: '13px',
	}),
	trendIndicator: {
		height: '14px',
		width: '14px',
	} as SxProps,
	trendMetric: {
		fontWeight: 'bold',
		fontSize: '13px',
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
