import { useGuide } from '@/components/Guideline/hooks';
import { ROUTES } from '@/routes/constants';
import AddIcon from '@mui/icons-material/Add';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banner, ListingMatchesDialog, Title } from './components';
import { styles } from './utils';
import { GuideType } from '@/components/Guideline/constants';

function HomePage() {
	const navigate = useNavigate();
	const handleStartNewGameClick = () => {
		navigate(ROUTES.CREATE_NEW_MATCH);
	};

	const { onStartGuide, settingGuide } = useGuide();

	useEffect(() => {
		if (!settingGuide.includes(GuideType.HOME)) {
			onStartGuide(GuideType.HOME);
		}
	}, []);

	return (
		<Stack sx={styles.wrapper} spacing={4}>
			<Stack sx={styles.content} spacing={1}>
				<Banner />
				<Title />
			</Stack>
			<Stack spacing={1}>
				<Button
					id="start-btn"
					size="large"
					variant="contained"
					startIcon={<AddIcon />}
					onClick={handleStartNewGameClick}
				>
					Bắt Đầu
				</Button>
				<ListingMatchesDialog>
					<Button id="continue-btn" size="large" variant="outlined" startIcon={<ArrowRightIcon />}>
						Tiếp tục
					</Button>
				</ListingMatchesDialog>
			</Stack>
		</Stack>
	);
}

export default HomePage;
