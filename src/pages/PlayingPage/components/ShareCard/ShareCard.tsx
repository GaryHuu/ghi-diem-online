import { Dialog } from '@/components';
import { PlayerLeaderBoard } from '@/utils/types';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useShareCard from './useShareCard';
import styles from './styles';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	players: PlayerLeaderBoard[];
	matchId?: number;
};

function ShareCard({ isOpen, onClose, players, matchId }: Props) {
	const { t } = useTranslation();
	const { dataUrl, isReady, hasError, download } = useShareCard(isOpen, players, matchId);

	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			<Dialog.DialogTitle>{t('components.shareCard.title')}</Dialog.DialogTitle>
			<Dialog.DialogContent sx={styles.content}>
				{hasError ? (
					<Box sx={styles.loading}>
						<Typography color="error">{t('components.shareCard.error')}</Typography>
					</Box>
				) : isReady ? (
					<Box
						component="img"
						src={dataUrl}
						alt={t('components.shareCard.title')}
						sx={styles.preview}
					/>
				) : (
					<Box sx={styles.loading}>
						<CircularProgress />
					</Box>
				)}
			</Dialog.DialogContent>
			<Dialog.DialogActions>
				<Button onClick={onClose}>{t('common.buttons.cancel')}</Button>
				<Button variant="contained" onClick={download} disabled={!isReady}>
					{t('components.shareCard.download')}
				</Button>
			</Dialog.DialogActions>
		</Dialog>
	);
}

export default ShareCard;
