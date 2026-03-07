import { Dialog } from '@/components';
import helpers from '@/utils/helpers';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { IconButton, Stack } from '@mui/material';
import { Handle, Position, ReactFlow, Node as ReactFlowNode } from '@xyflow/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTransactions } from '../../hooks';
import styles from './styles';
import classes from './Transactions.module.scss';

type AvatarNodeProps = {
	data: { label: string; avatar?: string };
	type?: string;
};

function AvatarNode({ data, type }: AvatarNodeProps) {
	return (
		<>
			{type !== 'output' && <Handle type="source" position={Position.Right} />}
			{type !== 'input' && <Handle type="target" position={Position.Left} />}
			<Stack direction="row" alignItems="center" gap="4px" sx={{ px: '6px' }}>
				<Avatar
					src={data.avatar}
					sx={{
						width: 22,
						height: 22,
						fontSize: '10px',
						bgcolor: 'rgba(255,255,255,0.3)',
					}}
				>
					{helpers.getShortName(data.label)}
				</Avatar>
				<span
					style={{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
						fontSize: '12px',
					}}
				>
					{data.label}
				</span>
			</Stack>
		</>
	);
}

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

function Transactions({ isOpen, onClose }: Props) {
	const { t } = useTranslation();
	const { edges, nodes } = useTransactions();

	const nodeTypes = useMemo(
		() => ({
			input: (props: AvatarNodeProps) => <AvatarNode {...props} type="input" />,
			output: (props: AvatarNodeProps) => <AvatarNode {...props} type="output" />,
			default: AvatarNode,
		}),
		[],
	);

	return (
		<Dialog isOpen={isOpen} fullScreen>
			<Dialog.DialogTitle>
				<Stack sx={styles.header}>
					<IconButton sx={styles.p0} onClick={onClose}>
						<ArrowBackIcon />
					</IconButton>
					{t('pages.playing.paymentChart')}
				</Stack>
			</Dialog.DialogTitle>
			<Dialog.DialogContent dividers>
				<ReactFlow
					className={classes.reactFlow}
					nodes={nodes as ReactFlowNode[]}
					edges={edges}
					nodeTypes={nodeTypes}
					fitView
				/>
			</Dialog.DialogContent>
		</Dialog>
	);
}

export default Transactions;
