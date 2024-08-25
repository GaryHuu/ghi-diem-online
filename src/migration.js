import { DB_KEYS } from './utils/constants';

const migrations = () => {
	try {
		// Get the MY_IDS_OF_MATCHES list from localStorage
		let matches = JSON.parse(localStorage.getItem(DB_KEYS.MY_IDS_OF_MATCHES));

		// Check if matches exist and is an array
		if (Array.isArray(matches)) {
			matches = matches.filter((match) => {
				try {
					const matchIdKey = match.id.toString(); // Convert the id to string for localStorage key

					if (localStorage.getItem(matchIdKey)) {
						// If item exists in localStorage, remove it
						localStorage.removeItem(matchIdKey);
						return false; // Remove match from matches list
					}

					return true; // Keep match in matches list
				} catch (innerError) {
					console.error(`Error processing match with id ${match.id}:`, innerError);
					return true; // Keep the match if an error occurs
				}
			});

			// Update the MY_IDS_OF_MATCHES in localStorage
			localStorage.setItem(DB_KEYS.MY_IDS_OF_MATCHES, JSON.stringify(matches));
		}
	} catch (error) {
		console.error('An error occurred while processing MY_IDS_OF_MATCHES:', error);
	}
};

export { migrations };
