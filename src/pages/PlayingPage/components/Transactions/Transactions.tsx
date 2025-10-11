import { Dialog } from '@/components';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import { ReactFlow, Node as ReactFlowNode } from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import { useTransactions } from '../../hooks';
import styles from './styles';
import classes from './Transactions.module.scss';

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

function Transactions({ isOpen, onClose }: Props) {
	const { t } = useTranslation();
	const { edges, nodes } = useTransactions();
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
					fitView
				/>
			</Dialog.DialogContent>
		</Dialog>
	);
}

export default Transactions;
