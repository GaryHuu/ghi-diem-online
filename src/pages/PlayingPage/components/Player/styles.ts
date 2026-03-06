import { PRIMARY_COLOR } from '@/utils/constants';
import { SxProps } from '@mui/material';

const styles = {
	wrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: '12px',
		border: `1.5px solid #1976d2`,
		borderRadius: '0.5rem',
		backgroundColor: '#FFF',
		flex: 1,
	} as SxProps,
	titleWrapper: {
		gap: '0.5rem',
	} as SxProps,
	title: {
		whiteSpace: 'nowrap',
		fontWeight: 'bold',
		fontSize: '15px',
		cursor: 'pointer',
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
			color: increasingTrendValue >= 0 ? '#008000' : '#D32F2F',
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
};

export default styles;
