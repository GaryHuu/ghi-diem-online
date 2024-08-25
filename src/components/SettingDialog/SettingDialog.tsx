import { Dialog } from '@/components';
import { Box, Slider, Stack, SxProps, Typography } from '@mui/material';
import { SLIDER_MARKS, SLIDER_MAX_VALUE, SLIDER_MIN_VALUE, UNIT_OPTIONS } from './constants';
import styles from './styles';
import useSettingDialog from './useSettingDialog';

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

function SettingDialog({ isOpen, onClose }: Props) {
	const {
		settingValue: { unit, gap },
		onUnitChange,
		onGapChange,
	} = useSettingDialog();

	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			<Dialog.DialogTitle>Cài đặt</Dialog.DialogTitle>
			<Dialog.DialogContent>
				<Stack gap="1rem">
					<UnitSelection value={unit} onChange={onUnitChange} />
					<GapSelection value={gap} onChange={onGapChange} />
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

const UnitSelection = ({ value, onChange }: UnitSelectionProps) => (
	<Stack>
		<Typography sx={styles.title}>Đơn vị</Typography>
		<Stack direction="row" gap="0.5rem">
			{UNIT_OPTIONS.map((option) => (
				<UnitItem
					key={option.value}
					label={option.label}
					active={value === option.value}
					onClick={() => option.value !== value && onChange(option.value)}
				/>
			))}
		</Stack>
	</Stack>
);

type GapSelectionProps = {
	value: number;
	onChange: (newValue: number) => void;
};

const GapSelection = ({ value, onChange }: GapSelectionProps) => (
	<Stack>
		<Typography sx={styles.title}>Giá trị tăng/giảm</Typography>
		<Box px="8px">
			<Slider
				min={SLIDER_MIN_VALUE}
				max={SLIDER_MAX_VALUE}
				marks={SLIDER_MARKS}
				value={value}
				onChange={(_e, gap) => onChange(+gap)}
				sx={styles.gapSlider}
				valueLabelDisplay="on"
				aria-label="Always visible"
			/>
		</Box>
	</Stack>
);
