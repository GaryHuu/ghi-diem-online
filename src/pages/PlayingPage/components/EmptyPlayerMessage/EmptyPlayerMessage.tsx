import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import styles from './styles';

function EmptyPlayerMessage() {
	const { t } = useTranslation();

	return (
		<Typography sx={styles.wrapper}>
			<SentimentVeryDissatisfiedIcon />
			{t('components.emptyPlayer.message')}
			<br />
			{t('components.emptyPlayer.instruction')}
		</Typography>
	);
}

export default EmptyPlayerMessage;
