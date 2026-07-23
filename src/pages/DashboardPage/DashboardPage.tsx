import { ArrowBack as ArrowBackIcon, Logout as LogoutIcon } from '@mui/icons-material';
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	IconButton,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { LeaderBoard, Player, PlayingLayout } from '../PlayingPage/components';
import { usePlaying } from '../PlayingPage/hooks';
import { useDashboard } from './hooks';
import styles from './styles';

function DashboardPage() {
	const { t } = useTranslation();
	const { match } = usePlaying();
	const {
		view,
		username,
		password,
		matches,
		isSubmitting,
		isLoadingList,
		isLoadingDetail,
		setUsername,
		setPassword,
		login,
		logout,
		openMatch,
		backToList,
	} = useDashboard();

	if (view === 'login') {
		return (
			<Box
				component="form"
				sx={styles.loginWrapper}
				onSubmit={(event) => {
					event.preventDefault();
					login();
				}}
			>
				<Typography sx={styles.loginTitle}>{t('pages.dashboard.title')}</Typography>
				<TextField
					label={t('pages.dashboard.username')}
					value={username}
					onChange={(event) => setUsername(event.target.value)}
					autoComplete="username"
					fullWidth
				/>
				<TextField
					label={t('pages.dashboard.password')}
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					autoComplete="current-password"
					fullWidth
				/>
				<Button type="submit" variant="contained" disabled={isSubmitting}>
					{t('pages.dashboard.login')}
				</Button>
			</Box>
		);
	}

	if (view === 'detail') {
		if (isLoadingDetail || !match) {
			return (
				<Box sx={styles.stateWrapper}>
					<CircularProgress />
				</Box>
			);
		}

		return (
			<PlayingLayout>
				<Stack
					sx={styles.header}
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					gap="12px"
				>
					<IconButton color="primary" onClick={backToList} aria-label={t('pages.dashboard.back')}>
						<ArrowBackIcon />
					</IconButton>
					<Stack sx={{ minWidth: 0, flex: 1 }}>
						<Typography sx={styles.matchTitle}>
							{t('pages.playing.matchLabel', { name: match.data.name })}
						</Typography>
						<Box sx={styles.roundPill}>
							<Typography sx={styles.roundPillText}>
								{t('pages.playing.roundProgress', {
									current: match.current,
									total: match.total,
								})}
							</Typography>
						</Box>
					</Stack>
				</Stack>
				<LeaderBoard />
				<Box sx={styles.players}>
					{match.data.players.map((player) => (
						<Player key={player.id} player={player} onRename={() => {}} readOnly />
					))}
				</Box>
			</PlayingLayout>
		);
	}

	return (
		<Box sx={styles.listWrapper}>
			<Stack
				sx={styles.listHeader}
				direction="row"
				alignItems="center"
				justifyContent="space-between"
			>
				<Typography sx={styles.listTitle}>{t('pages.dashboard.title')}</Typography>
				<IconButton color="primary" onClick={logout} aria-label={t('pages.dashboard.logout')}>
					<LogoutIcon />
				</IconButton>
			</Stack>
			{isLoadingList ? (
				<Box sx={styles.stateWrapper}>
					<CircularProgress />
				</Box>
			) : matches.length === 0 ? (
				<Typography>{t('pages.dashboard.empty')}</Typography>
			) : (
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>{t('pages.dashboard.table.name')}</TableCell>
							<TableCell>{t('pages.dashboard.table.status')}</TableCell>
							<TableCell align="right">{t('pages.dashboard.table.rounds')}</TableCell>
							<TableCell align="right">{t('pages.dashboard.table.players')}</TableCell>
							<TableCell>{t('pages.dashboard.table.createdAt')}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{matches.map((item) => (
							<TableRow key={item.id} hover sx={styles.row} onClick={() => openMatch(item.id)}>
								<TableCell>{item.name}</TableCell>
								<TableCell>
									<Chip
										size="small"
										color={item.isFinished ? 'default' : 'primary'}
										label={
											item.isFinished
												? t('pages.dashboard.status.finished')
												: t('pages.dashboard.status.playing')
										}
									/>
								</TableCell>
								<TableCell align="right">{item.total}</TableCell>
								<TableCell align="right">{item.playerCount}</TableCell>
								<TableCell>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</Box>
	);
}

export default DashboardPage;
