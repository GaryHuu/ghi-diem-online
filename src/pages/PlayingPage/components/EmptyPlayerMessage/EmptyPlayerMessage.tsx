import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Typography } from '@mui/material';
import styles from './styles';

function EmptyPlayerMessage() {
	return (
		<Typography sx={styles.wrapper}>
			<SentimentVeryDissatisfiedIcon />
			Bạn chưa bất kỳ người chơi nào.
			<br />
			Vui lòng tạo bằng cách ấn nút bên dưới
		</Typography>
	);
}

export default EmptyPlayerMessage;
