export interface Player {
	id: number;
	name: string;
	scores: number[];
}

export interface MatchWithoutPlayers {
	id: number;
	name: string;
	isFinished?: boolean;
}

export interface Match extends MatchWithoutPlayers {
	players: Player[];
}

export type Unit = number;

export type Gap = number;

export interface Setting {
	unit: Unit;
	gap: Gap;
}

export interface ErrorType {
	message: string;
}

export interface PlayerLeaderBoard {
	id: number;
	name: string;
	score: number;
}
