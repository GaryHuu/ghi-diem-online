import { Dialog } from '@/components';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import { Node as ReactFlowNode, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTransactions } from '../../hooks';
import styles from './styles';

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

function Transactions({ isOpen, onClose }: Props) {
	const { edges, nodes } = useTransactions();
	return (
		<Dialog isOpen={isOpen} fullScreen>
			<Dialog.DialogTitle>
				<Stack sx={styles.header}>
					<IconButton sx={styles.p0} onClick={onClose}>
						<ArrowBackIcon />
					</IconButton>
					Biểu đồ thanh toán
				</Stack>
			</Dialog.DialogTitle>
			<Dialog.DialogContent dividers>
				<ReactFlow nodes={nodes as ReactFlowNode[]} edges={edges} fitView nodeTypes={{}} />
			</Dialog.DialogContent>
		</Dialog>
	);
}

export default Transactions;
