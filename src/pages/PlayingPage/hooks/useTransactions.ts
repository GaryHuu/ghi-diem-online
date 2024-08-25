import { useMemo } from 'react';
import usePlaying from './usePlaying';
import { useFormatCurrency } from '@/hooks';
import { MarkerType } from '@xyflow/react';
import { PlayerLeaderBoard } from '@/utils/types';
import helpers from '@/utils/helpers';

function useTransactions() {
	const { formatCurrency } = useFormatCurrency();
	const { leaderBoardPlayers } = usePlaying();

	const [debtors, creditors] = useMemo(() => {
		const _debtors: PlayerLeaderBoard[] = [];
		const _creditors: PlayerLeaderBoard[] = [];

		for (let i = 0; i < leaderBoardPlayers.length; i++) {
			const player = leaderBoardPlayers[i];

			if (player.score === 0) continue;

			if (player.score > 0) {
				_creditors.push(player);
				continue;
			}

			_debtors.push(player);
		}

		return [_debtors, _creditors];
	}, [leaderBoardPlayers]);

	const transactions = useMemo(() => {
		const _transactions = [];
		const _debtors = JSON.parse(JSON.stringify(debtors));
		const _creditors = JSON.parse(JSON.stringify(creditors));

		let i = 0;
		let j = 0;

		while (i < _debtors.length && j < _creditors.length) {
			const debt = Math.abs(_debtors[i].score);
			const credit = _creditors[j].score;
			const total = Math.min(debt, credit);

			_transactions.push({
				from: {
					id: _debtors[i].id,
					name: _debtors[i].name,
				},
				to: {
					id: _creditors[j].id,
					name: _creditors[j].name,
				},
				total,
			});

			_debtors[i].score += total;
			_creditors[j].score -= total;

			if (_debtors[i].score === 0) {
				i++;
			}

			if (_creditors[j].score === 0) {
				j++;
			}
		}

		return _transactions;
	}, [creditors, debtors]);

	const edges = useMemo(() => {
		return transactions.map((transaction) => {
			return {
				id: `e${transaction.from.id}-${transaction.to.id}`,
				source: transaction.from.id.toString(),
				target: transaction.to.id.toString(),
				label: formatCurrency(transaction.total),
				animated: true,
				markerEnd: {
					type: MarkerType.ArrowClosed,
				},
				type: 'straight',
			};
		});
	}, [formatCurrency, transactions]);

	const nodes = useMemo(() => {
		const nodeHeight = 30;
		const nodeWidth = 100;
		const gapY = 70;
		const gapX = 150;
		const leftHeight = debtors.length * nodeHeight + (debtors.length - 1) * gapY;
		const rightHeight = creditors.length * nodeHeight + (creditors.length - 1) * gapY;

		let leftY = leftHeight >= rightHeight ? 0 : (rightHeight - leftHeight) / 2;
		let rightY = rightHeight >= leftHeight ? 0 : (leftHeight - rightHeight) / 2;

		return leaderBoardPlayers.map((player) => {
			const isCreditors = !!creditors.find((item) => item.id === player.id);
			const isDebtors = !!debtors.find((item) => item.id === player.id);
			const type = isCreditors ? 'output' : isDebtors ? 'input' : 'selectorNode';
			const positionX = isCreditors ? gapX + nodeWidth : 0;
			let positionY;

			if (isCreditors) {
				positionY = rightY;
				rightY = rightY + nodeHeight + gapY;
			}

			if (isDebtors) {
				positionY = leftY;
				leftY = leftY + nodeHeight + gapY;
			}

			return {
				id: player.id.toString(),
				type,
				hidden: !isDebtors && !isCreditors,
				sourcePosition: 'right',
				targetPosition: 'left',
				style: {
					width: 120,
					height: nodeHeight,
					background: helpers.stringToColor(player.name),
					color: 'white',
				},
				position: {
					x: positionX,
					y: positionY,
				},
				data: {
					label: player.name,
				},
			};
		});
	}, [debtors, creditors, leaderBoardPlayers]);

	return { nodes, edges };
}

export default useTransactions;
