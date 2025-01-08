import Joyride, { Step, TooltipRenderProps } from 'react-joyride';
import { useGuide } from './hooks';
import { GuideType } from './constants';
import { Typography, Button, Box, Stack } from '@mui/material';
import styles from './styles';
interface Props {
	steps: Step[];
	type: GuideType;
}

const CustomTooltip = (props: TooltipRenderProps) => {
	const { backProps, isLastStep, index, primaryProps, skipProps, step, tooltipProps, size } = props;
	console.log({ primaryProps, step, tooltipProps });
	return (
		<Box sx={styles.tooltip} {...tooltipProps}>
			{step.title && <Typography variant="h2">{step.title}</Typography>}
			{step.content && <Typography sx={styles.content}>{step.content}</Typography>}
			<Stack direction="row" justifyContent={isLastStep ? 'center' : 'space-between'}>
				{!isLastStep && (
					<Button variant="text" {...skipProps}>
						SKIP
					</Button>
				)}
				<Stack direction="row" gap={2}>
					{index > 0 && (
						<Button {...backProps} variant="outlined">
							Quay lại
						</Button>
					)}
					<Button
						{...primaryProps}
						variant="contained"
					>{`${index + 1 < size ? 'Đi tiếp' : 'Kết thúc'} (${index + 1}/${size})`}</Button>
				</Stack>
			</Stack>
		</Box>
	);
};

function Guideline({ steps, type }: Props) {
	const { guideType, handleJoyrideCallback } = useGuide();

	const isRunned = guideType === type;
	return (
		<Joyride
			disableOverlayClose
			run={isRunned}
			steps={steps}
			continuous
			showProgress
			showSkipButton
			callback={handleJoyrideCallback}
			styles={{
				options: {
					zIndex: 10000,
				},
			}}
			tooltipComponent={CustomTooltip}
		/>
	);
}

export default Guideline;
