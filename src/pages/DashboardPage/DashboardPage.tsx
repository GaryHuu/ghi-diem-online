import { AdminMatchSummary } from '@/api';
import { ArrowBack as ArrowBackIcon, Logout as LogoutIcon } from '@mui/icons-material';
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	IconButton,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { viVN } from '@mui/x-data-grid/locales';
import dayjs from 'dayjs';
import { useMemo } from 'react';
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

	const columns: GridColDef<AdminMatchSummary>[] = useMemo(
		() => [
			{ field: 'name', headerName: t('pages.dashboard.table.name'), flex: 1, minWidth: 150 },
			{
				field: 'isFinished',
				headerName: t('pages.dashboard.table.status'),
				width: 130,
				renderCell: (params) => (
					<Chip
						size="small"
						color={params.value ? 'default' : 'primary'}
						label={
							params.value
								? t('pages.dashboard.status.finished')
								: t('pages.dashboard.status.playing')
						}
					/>
				),
			},
			{
				field: 'deviceId',
				headerName: t('pages.dashboard.table.device'),
				width: 120,
				renderCell: (params) => (
					<Tooltip title={params.value}>
						<Typography component="span" sx={styles.deviceId}>
							{params.value.slice(0, 8)}
						</Typography>
					</Tooltip>
				),
			},
			{ field: 'total', headerName: t('pages.dashboard.table.rounds'), type: 'number', width: 90 },
			{
				field: 'playerCount',
				headerName: t('pages.dashboard.table.players'),
				type: 'number',
				width: 130,
			},
			{
				field: 'createdAt',
				headerName: t('pages.dashboard.table.createdAt'),
				width: 150,
				valueFormatter: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
			},
			{
				field: 'deletedAt',
				headerName: t('pages.dashboard.table.deletedAt'),
				width: 160,
				renderCell: (params) =>
					params.value ? (
						<Chip
							size="small"
							color="error"
							variant="outlined"
							label={dayjs(params.value).format('DD/MM/YYYY HH:mm')}
						/>
					) : (
						'—'
					),
			},
		],
		[t],
	);

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
				<DataGrid
					rows={matches}
					columns={columns}
					autoHeight
					disableRowSelectionOnClick
					onRowClick={(params) => openMatch(params.row.id)}
					localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
					slots={{ toolbar: GridToolbar }}
					slotProps={{ toolbar: { showQuickFilter: true } }}
					initialState={{
						pagination: { paginationModel: { pageSize: 10 } },
						sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] },
					}}
					pageSizeOptions={[10, 25, 50]}
					sx={styles.grid}
				/>
			)}
		</Box>
	);
}

export default DashboardPage;
