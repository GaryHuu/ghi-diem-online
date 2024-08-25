import { ROUTES } from '@/routes/constants';
import AddIcon from '@mui/icons-material/Add';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { Banner, ListingMatchesDialog, Title } from './components';
import { styles } from './utils';

function HomePage() {
	const navigate = useNavigate();

	const handleStartNewGameClick = () => {
		navigate(ROUTES.CREATE_NEW_MATCH);
	};

	return (
		<Stack sx={styles.wrapper} spacing={4}>
			<Stack sx={styles.content} spacing={1}>
				<Banner />
				<Title />
			</Stack>
			<Stack spacing={1}>
				<Button
					size="large"
					variant="contained"
					startIcon={<AddIcon />}
					onClick={handleStartNewGameClick}
				>
					Bắt Đầu
				</Button>
				<ListingMatchesDialog>
					<Button size="large" variant="outlined" startIcon={<ArrowRightIcon />}>
						Tiếp tục
					</Button>
				</ListingMatchesDialog>
			</Stack>
		</Stack>
	);
}

export default HomePage;
