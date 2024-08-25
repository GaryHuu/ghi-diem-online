import { PRIMARY_COLOR } from '@/utils/constants';
import { SxProps } from '@mui/material';

const styles = {
	wrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: '12px',
		border: `1.5px solid #1976d2`,
		borderRadius: '0.5rem',
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
	autoFill: {
		fontSize: '14px',
		textAlign: 'center',
		cursor: 'pointer',
	} as SxProps,
};

export default styles;
