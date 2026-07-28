import { Dialog } from '@/components';
import { TOUR_REPLAY_EVENT } from '@/hooks/usePlayingTour';
import { ROUTES } from '@/routes/constants';
import {
	DarkMode as DarkModeIcon,
	HelpOutline as HelpOutlineIcon,
	LightMode as LightModeIcon,
	SettingsBrightness as SettingsBrightnessIcon,
} from '@mui/icons-material';
import { Box, Button, Stack, TextField, Theme, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useMatch } from 'react-router-dom';
import { ColorScheme, UIMode } from '@/utils/types';
import { COLOR_SCHEME_OPTIONS, LANGUAGE_OPTIONS, UI_MODE_OPTIONS, UNIT_OPTIONS } from './constants';
import styles from './styles';
import useSettingDialog from './useSettingDialog';
import { useTranslation } from 'react-i18next';

const COLOR_SCHEME_ICON: Record<ColorScheme, typeof LightModeIcon> = {
	light: LightModeIcon,
	dark: DarkModeIcon,
	system: SettingsBrightnessIcon,
};

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

function SettingDialog({ isOpen, onClose }: Props) {
	const { t } = useTranslation();
	const {
		settingValue: { unit, gap, language, uiMode, colorScheme },
		onUnitChange,
		onGapChange,
		// onLanguageChange,
		onUIModeChange,
		onColorSchemeChange,
	} = useSettingDialog();
	// The tour lives on the match page, so only offer replay from there.
	const isOnMatchPage = !!useMatch(ROUTES.MATCH);

	const handleReplayTour = () => {
		onClose();
		window.dispatchEvent(new Event(TOUR_REPLAY_EVENT));
	};

	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			<Dialog.DialogTitle>{t('components.settingDialog.title')}</Dialog.DialogTitle>
			<Dialog.DialogContent>
				<Stack gap="1rem">
					<UnitSelection value={unit} onChange={onUnitChange} />
					<GapSelection value={gap} onChange={onGapChange} />
					<UIModeSelection value={uiMode} onChange={onUIModeChange} />
					<ColorSchemeSelection value={colorScheme} onChange={onColorSchemeChange} />
					{isOnMatchPage && (
						<Button
							variant="outlined"
							size="small"
							startIcon={<HelpOutlineIcon />}
							onClick={handleReplayTour}
							sx={{ alignSelf: 'flex-start' }}
						>
							{t('components.tour.replay')}
						</Button>
					)}
					{/* TODO: temporarily disabled English, re-enable later */}
					{/* <LanguageSelection value={language} onChange={onLanguageChange} /> */}
					<Typography component="p" sx={styles.copyright}>
						{t('components.settingDialog.copyright')}
					</Typography>
				</Stack>
			</Dialog.DialogContent>
		</Dialog>
	);
}

export default SettingDialog;

type UnitItemProps = {
	label: string;
	active: boolean;
	onClick: () => void;
};

const UnitItem = ({ label, active, onClick }: UnitItemProps) => {
	return (
		<Box onClick={onClick} sx={styles.unitItem(active)}>
			{label}
		</Box>
	);
};

type UnitSelectionProps = {
	value: number;
	onChange: (newValue: number) => void;
};

const UnitSelection = ({ value, onChange }: UnitSelectionProps) => {
	const { t } = useTranslation();
	return (
		<Stack>
			<Typography sx={styles.title}>{t('components.settingDialog.unit')}</Typography>
			<Stack direction="row" gap="0.5rem">
				{UNIT_OPTIONS.map((option) => (
					<UnitItem
						key={option.value}
						label={t(option.labelKey)}
						active={value === option.value}
						onClick={() => option.value !== value && onChange(option.value)}
					/>
				))}
			</Stack>
		</Stack>
	);
};

type GapSelectionProps = {
	value: number;
	onChange: (newValue: number) => void;
};

const GapSelection = ({ value, onChange }: GapSelectionProps) => {
	const { t } = useTranslation();
	const [displayValue, setDisplayValue] = useState<string>(value.toString());

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		setDisplayValue(raw);
		const num = +raw;
		if (num >= 1) onChange(num);
	};

	const handleBlur = () => {
		const num = +displayValue;
		if (num < 1 || isNaN(num)) {
			setDisplayValue(value.toString());
		}
	};

	return (
		<Stack>
			<Typography sx={styles.title}>{t('components.settingDialog.gapValue')}</Typography>
			<TextField
				type="number"
				value={displayValue}
				onChange={handleChange}
				onBlur={handleBlur}
				size="small"
				inputProps={{ min: 1 }}
				sx={{ maxWidth: '120px' }}
			/>
		</Stack>
	);
};

type LanguageSelectionProps = {
	value: string;
	onChange: (newValue: string) => void;
};

type UIModeSelectionProps = {
	value: UIMode;
	onChange: (newValue: UIMode) => void;
};

const UIModeSelection = ({ value, onChange }: UIModeSelectionProps) => {
	const { t } = useTranslation();
	return (
		<Stack>
			<Typography sx={styles.title}>{t('components.settingDialog.uiMode')}</Typography>
			<Stack direction="row" gap="0.5rem">
				{UI_MODE_OPTIONS.map((option) => (
					<Box
						key={option.value}
						onClick={() => option.value !== value && onChange(option.value)}
						sx={styles.unitItem(value === option.value)}
					>
						{t(option.labelKey)}
					</Box>
				))}
			</Stack>
		</Stack>
	);
};

type ColorSchemeSelectionProps = {
	value: ColorScheme;
	onChange: (newValue: ColorScheme) => void;
};

const ColorSchemeSelection = ({ value, onChange }: ColorSchemeSelectionProps) => {
	const { t } = useTranslation();
	return (
		<Stack>
			<Typography sx={styles.title}>{t('components.settingDialog.colorScheme')}</Typography>
			<Stack direction="row" gap="0.5rem">
				{COLOR_SCHEME_OPTIONS.map((option) => {
					const Icon = COLOR_SCHEME_ICON[option.value];
					const label = t(option.labelKey);
					return (
						<Tooltip key={option.value} title={label}>
							<Box
								onClick={() => option.value !== value && onChange(option.value)}
								sx={styles.iconItem(value === option.value)}
								aria-label={label}
							>
								<Icon fontSize="small" />
							</Box>
						</Tooltip>
					);
				})}
			</Stack>
		</Stack>
	);
};

const LanguageSelection = ({ value, onChange }: LanguageSelectionProps) => {
	const { t } = useTranslation();
	return (
		<Stack>
			<Typography sx={styles.title}>{t('components.settingDialog.language')}</Typography>
			<Stack direction="row" gap="0.5rem">
				{LANGUAGE_OPTIONS.map((option) => (
					<Box
						key={option.value}
						onClick={() => option.value !== value && onChange(option.value)}
						sx={(theme: Theme) => ({
							...(styles.unitItem(value === option.value)(theme) as Record<string, unknown>),
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem',
							cursor: 'pointer',
						})}
					>
						<img
							src={`https://flagcdn.com/w40/${option.flagCode}.png`}
							srcSet={`https://flagcdn.com/w80/${option.flagCode}.png 2x`}
							width="24"
							alt={option.label}
							style={{ borderRadius: '2px' }}
						/>
						<span>{option.label}</span>
					</Box>
				))}
			</Stack>
		</Stack>
	);
};
