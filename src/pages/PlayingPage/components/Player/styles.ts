import { PRIMARY_COLOR } from '@/utils/constants';
import helpers from '@/utils/helpers';
import { SxProps } from '@mui/material';

const styles = {
	wrapper: (autoFill?: boolean) =>
		({
			padding: '8px 12px',
			gap: '4px',
			border: `1px solid ${PRIMARY_COLOR}`,
			borderRadius: '0.5rem',
			backgroundColor: autoFill ? '#e3f2fd' : '#FFF',
			flex: 1,
		}) as SxProps,
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
	title: {
		whiteSpace: 'nowrap',
		fontWeight: 'bold',
		fontSize: '15px',
		userSelect: 'none',
	} as SxProps,
	scoreWrapper: {
		flexDirection: 'row',
		gap: '0.25rem',
	} as SxProps,
	score: (total: number) =>
		({
			fontWeight: 'bold',
			fontSize: '14px',
			color: total >= 0 ? (total === 0 ? PRIMARY_COLOR : '#008000') : '#D32F2F',
		}) as SxProps,
	trendWrapper: (increasingTrendValue: number) =>
		({
			flexDirection: 'row',
			alignItems: 'center',
			color: increasingTrendValue > 0 ? '#008000' : increasingTrendValue < 0 ? '#D32F2F' : '#888',
			fontSize: '14px',
		}) as SxProps,
	trendIndicator: {
		height: '16px',
		marginLeft: '-4px',
	} as SxProps,
	trendMetric: {
		fontWeight: 'bold',
		fontSize: '14px',
	} as SxProps,
	gapBadge: (hasCustomGap: boolean) =>
		({
			cursor: 'pointer',
			gap: '2px',
			padding: '1px 6px',
			borderRadius: '12px',
			border: `1px solid ${hasCustomGap ? PRIMARY_COLOR : '#bbb'}`,
			backgroundColor: hasCustomGap ? '#e3f2fd' : 'transparent',
			color: hasCustomGap ? PRIMARY_COLOR : '#888',
			userSelect: 'none',
		}) as SxProps,
	resetGap: {
		fontSize: '12px',
		color: '#D32F2F',
		cursor: 'pointer',
		textAlign: 'center',
		mt: '4px',
	} as SxProps,
	dragHandle: {
		display: 'flex',
		alignItems: 'center',
		cursor: 'grab',
		color: '#999',
		touchAction: 'none',
		'&:active': {
			cursor: 'grabbing',
		},
	} as SxProps,
	dragIcon: {
		fontSize: '20px',
	} as SxProps,
};

export default styles;
