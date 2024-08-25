import { Player } from '@/utils/types';

export enum Mode {
	Create = 'CREATE',
	Edit = 'EDIT',
}

export type PlayerForm = Omit<Partial<Player>, 'scores'>;
