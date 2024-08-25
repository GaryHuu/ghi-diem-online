import { DB_KEYS } from './utils/constants';

const migrations = () => {
	try {
		let matches = JSON.parse(localStorage.getItem(DB_KEYS.MY_IDS_OF_MATCHES));

		if (Array.isArray(matches)) {
			matches = matches.forEach((match) => {
				try {
					const matchIdKey = match.id.toString();

					const value = localStorage.getItem(matchIdKey);
					if (value) {
						localStorage.removeItem(matchIdKey);
						localStorage.setItem(DB_KEYS + matchIdKey, value);
					}
				} catch (innerError) {
					console.error(`Error processing match with id ${match.id}:`, innerError);
				}
			});

			localStorage.setItem(DB_KEYS.MY_IDS_OF_MATCHES, JSON.stringify(matches));
		}
	} catch (error) {
		console.error('An error occurred while processing MY_IDS_OF_MATCHES:', error);
	}
};

export { migrations };
