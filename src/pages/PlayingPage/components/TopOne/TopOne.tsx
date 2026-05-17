import { useFormatCurrency } from '@/hooks';
import helpers from '@/utils/helpers';
import { Avatar, Box, Typography } from '@mui/material';
import CrownIcon from './CrownIcon';
import styles from './styles';

type Props = {
	name: string;
	score: number;
	avatar?: string;
};

function TopOne({ name, score, avatar }: Props) {
	const { formatCurrency } = useFormatCurrency();

	return (
		<Box>
			<Box sx={styles.wrapper}>
				<Box sx={styles.avatarWrapper}>
					<CrownIcon sx={styles.iconCrown} />
					<Avatar src={avatar} sx={styles.avatar(name)}>
						{helpers.getShortName(name)}
					</Avatar>
					<Box sx={styles.topNumber}>1</Box>
				</Box>
			</Box>
			<Typography sx={styles.name}>{name}</Typography>
			<Typography sx={styles.score}>{formatCurrency(score)}</Typography>
		</Box>
	);
}

export default TopOne;
