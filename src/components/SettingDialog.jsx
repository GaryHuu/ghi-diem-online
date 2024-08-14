import { Box, Slider, Stack, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types';
import React from 'react';
import useAppProvider from '@/hooks/useAppProvider';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const UnitItem = ({ label, active, onClick }) => {
	return (
		<Box
			onClick={onClick}
			sx={{
				cursor: 'pointer',
				minWidth: '100px',
				border: `1px solid #1976D2`,
				borderRadius: '4px',
				padding: '6px 8px',
				textAlign: 'center',
				color: active ? '#FFF' : '#000',
				backgroundColor: active ? '#1976D2' : 'transparent',
			}}
		>
			{label}
		</Box>
	);
};

UnitItem.propTypes = {
	label: PropTypes.string,
	active: PropTypes.bool,
	onClick: PropTypes.func,
};

function SettingDialog({ isOpen, onClose }) {
	const { value, onChange } = useAppProvider();

	const handleSettingChange = (newValue) => () => {
		onChange({
			...value,
			...newValue,
		});
	};

	return (
		<Dialog
			onClose={onClose}
			open={isOpen}
			TransitionComponent={Transition}
			scroll="paper"
			fullWidth
		>
			<DialogTitle>Cài đặt</DialogTitle>
			<DialogContent
				dividers
				sx={{
					padding: '16px',
				}}
			>
				<Stack gap="1rem">
					<Stack>
						<Typography
							sx={{
								fontWeight: 'bold',
								mb: '4px',
							}}
						>
							Đơn vị
						</Typography>
						<Stack direction="row" gap="0.5rem">
							<UnitItem
								label="1đ"
								active={value.unit === 1}
								onClick={handleSettingChange({ unit: 1 })}
							/>
							<UnitItem
								label="1.000đ"
								active={value.unit === 1000}
								onClick={handleSettingChange({ unit: 1000 })}
							/>
						</Stack>
					</Stack>
					<Stack>
						<Typography
							sx={{
								fontWeight: 'bold',
								mb: '4px',
							}}
						>
							Giá trị tăng/giảm
						</Typography>
						<Box sx={{ px: '8px' }}>
							<Slider
								aria-label="Always visible"
								valueLabelDisplay="on"
								value={value.gap}
								onChange={(_e, gap) => handleSettingChange({ gap })()}
								min={1}
								max={20}
								marks={[
									{
										value: 1,
										label: '1',
									},
									{
										value: 2,
										label: '2',
									},
									{
										value: 5,
										label: '5',
									},
									{
										value: 10,
										label: '10',
									},
									{
										value: 20,
										label: '20',
									},
								]}
								sx={{
									'& .MuiSlider-valueLabel': {
										backgroundColor: '#1976d2de',
										color: '#FFF',

										'&:before': {
											backgroundColor: '#1976d2de',
										},
									},
								}}
							/>
						</Box>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

SettingDialog.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
};

export default SettingDialog;
