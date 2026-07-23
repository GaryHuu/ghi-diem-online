import { API_BASE_URL } from '@/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateMatchDetail } from '@/redux/slices/matchSlice';
import { RootState } from '@/redux/store';
import { Match } from '@/utils/types';
import { useEffect, useRef } from 'react';

const MAX_BACKOFF_MS = 10000;

const getSocketUrl = (token: string): string => {
	const base = API_BASE_URL.replace(/^http/, 'ws');
	return `${base}/ws/share/${token}`;
};

/**
 * Subscribes to live match snapshots for a shared token via WebSocket.
 * Score-path snapshots exclude avatars (kept light); the connect snapshot and
 * player add/update broadcasts include them. Cached avatars fill the gaps.
 */
function useShareSocket(token?: string) {
	const dispatch = useAppDispatch();
	const players = useAppSelector((state: RootState) => state.match.matchDetail?.data.players);
	const isShowResult = useAppSelector(
		(state: RootState) => state.match.matchDetail?.isShowResult ?? false,
	);

	const current = useAppSelector((state: RootState) => state.match.matchDetail?.current);
	const total = useAppSelector((state: RootState) => state.match.matchDetail?.total);

	const avatarMapRef = useRef<Record<number, string | undefined>>({});
	const isShowResultRef = useRef(isShowResult);
	const positionRef = useRef({ current, total });

	useEffect(() => {
		positionRef.current = { current, total };
	}, [current, total]);

	useEffect(() => {
		players?.forEach((player) => {
			if (player.avatar) avatarMapRef.current[player.id] = player.avatar;
			else delete avatarMapRef.current[player.id];
		});
	}, [players]);

	useEffect(() => {
		isShowResultRef.current = isShowResult;
	}, [isShowResult]);

	useEffect(() => {
		if (!token) return;

		let socket: WebSocket | null = null;
		let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
		let retry = 0;
		let isClosed = false;

		const connect = () => {
			socket = new WebSocket(getSocketUrl(token));

			socket.onopen = () => {
				retry = 0;
			};

			socket.onmessage = (event) => {
				try {
					const envelope = JSON.parse(event.data);
					if (envelope.type !== 'match.snapshot') return;

					const data = envelope.data as Match;
					const merged: Match = {
						...data,
						players: data.players.map((player) => ({
							...player,
							// Key present (even null) = authoritative, e.g. avatar removed;
							// key absent = light score-path snapshot, fall back to cache.
							avatar:
								'avatar' in player ? (player.avatar ?? undefined) : avatarMapRef.current[player.id],
						})),
					};
					const newTotal = merged.players.find(Boolean)?.scores.length || 1;
					// Follow the live game only when the viewer is already at the
					// latest round; keep their position while browsing older rounds.
					const prev = positionRef.current;
					const isAtLatest = !prev.current || !prev.total || prev.current >= prev.total;
					const viewerCurrent = isAtLatest || !prev.current ? newTotal : prev.current;

					dispatch(
						updateMatchDetail({
							current: viewerCurrent,
							total: newTotal,
							data: merged,
							isShowResult: isShowResultRef.current,
						}),
					);
				} catch {
					// Ignore malformed messages
				}
			};

			socket.onclose = () => {
				if (isClosed) return;
				retry += 1;
				const delay = Math.min(1000 * 2 ** (retry - 1), MAX_BACKOFF_MS);
				reconnectTimer = setTimeout(connect, delay);
			};
		};

		connect();

		return () => {
			isClosed = true;
			if (reconnectTimer) clearTimeout(reconnectTimer);
			socket?.close();
		};
	}, [token, dispatch]);
}

export default useShareSocket;
