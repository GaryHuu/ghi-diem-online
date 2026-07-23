import { Dialog } from '@/components';
import { matchService } from '@/services';
import { translateError } from '@/utils/helpers';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import styles from './styles';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	matchId?: number;
};

function ShareLinkDialog({ isOpen, onClose, matchId }: Props) {
	const { t } = useTranslation();
	const [token, setToken] = useState<string>();
	const [isLoading, setIsLoading] = useState(false);
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		if (!isOpen || !matchId || token) return;

		setIsLoading(true);
		matchService
			.share(matchId)
			.then((result) => setToken(result.token))
			.catch((error) => toast.error(translateError(error, t)))
			.finally(() => setIsLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, matchId]);

	const shareUrl = token ? `${window.location.origin}/share/${token}` : '';

	const handleCopy = async () => {
		if (!shareUrl) return;
		await navigator.clipboard.writeText(shareUrl);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			<Dialog.DialogTitle>{t('components.shareLink.title')}</Dialog.DialogTitle>
			<Dialog.DialogContent sx={styles.content}>
				<Typography sx={styles.description}>{t('components.shareLink.description')}</Typography>
				{isLoading ? (
					<Box sx={styles.loading}>
						<CircularProgress size={24} />
					</Box>
				) : (
					<TextField
						value={shareUrl}
						InputProps={{ readOnly: true }}
						size="small"
						fullWidth
						onFocus={(e) => e.target.select()}
					/>
				)}
			</Dialog.DialogContent>
			<Dialog.DialogActions>
				<Button onClick={onClose}>{t('components.shareLink.close')}</Button>
				<Button
					variant="contained"
					startIcon={<ContentCopyIcon />}
					onClick={handleCopy}
					disabled={!token}
				>
					{isCopied ? t('components.shareLink.copied') : t('components.shareLink.copy')}
				</Button>
			</Dialog.DialogActions>
		</Dialog>
	);
}

export default ShareLinkDialog;
