import { Dialog } from '@/components';
import { Box, Stack, SxProps, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { LANGUAGE_OPTIONS, UNIT_OPTIONS } from './constants';
import styles from './styles';
import useSettingDialog from './useSettingDialog';
import { useTranslation } from 'react-i18next';

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

function SettingDialog({ isOpen, onClose }: Props) {
	const { t } = useTranslation();
	const {
		settingValue: { unit, gap, language },
		onUnitChange,
		onGapChange,
		onLanguageChange,
	} = useSettingDialog();

	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			<Dialog.DialogTitle>{t('components.settingDialog.title')}</Dialog.DialogTitle>
			<Dialog.DialogContent>
				<Stack gap="1rem">
					<UnitSelection value={unit} onChange={onUnitChange} />
					<GapSelection value={gap} onChange={onGapChange} />
					{/* TODO: temporarily disabled English, re-enable later */}
					{/* <LanguageSelection value={language} onChange={onLanguageChange} /> */}
					<p style={{ fontSize: '14px', color: '#555' }}>
						{t('components.settingDialog.copyright')}
					</p>
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
		<Box onClick={onClick} sx={styles.unitItem(active) as SxProps}>
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
						sx={{
							...styles.unitItem(value === option.value),
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem',
							cursor: 'pointer',
						}}
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
