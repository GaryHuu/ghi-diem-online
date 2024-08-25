import Crown from '@/assets/icons/crown-svgrepo-com.svg';
import { useFormatCurrency } from '@/hooks';
import helpers from '@/utils/helpers';
import { Avatar, Box, Typography } from '@mui/material';
import { CSSProperties } from 'react';
import styles from './styles';

type Props = {
	name: string;
	score: number;
};

function TopOne({ name, score }: Props) {
	const { formatCurrency } = useFormatCurrency();

	return (
		<Box>
			<Box sx={styles.wrapper}>
				<Box sx={styles.avatarWrapper}>
					<img src={Crown} alt="Crown" style={styles.iconCrown as CSSProperties} />
					<Avatar sx={styles.avatar(name)}>{helpers.getShortName(name)}</Avatar>
					<div style={styles.topNumber as CSSProperties}>1</div>
				</Box>
			</Box>
			<Typography sx={styles.name}>{name}</Typography>
			<Typography sx={styles.score}>{formatCurrency(score)}</Typography>
		</Box>
	);
}

export default TopOne;
