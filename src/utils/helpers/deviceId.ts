const DEVICE_ID_KEY = 'deviceId';

/**
 * Returns the anonymous device UUID, generating and persisting it once.
 */
export const getDeviceId = (): string => {
	let deviceId = localStorage.getItem(DEVICE_ID_KEY);

	if (!deviceId) {
		deviceId = crypto.randomUUID();
		localStorage.setItem(DEVICE_ID_KEY, deviceId);
	}

	return deviceId;
};
