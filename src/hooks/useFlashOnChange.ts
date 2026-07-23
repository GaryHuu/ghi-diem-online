import { useEffect, useRef, useState } from 'react';

const FLASH_MS = 1200;

/**
 * Returns true for a short moment after `value` changes, so the UI can flash
 * a highlight. Changing `contextKey` (e.g. the viewed game number) resets the
 * baseline without flashing — only real data changes trigger the highlight.
 */
function useFlashOnChange(value: number, contextKey: number): boolean {
	const [isFlashing, setIsFlashing] = useState(false);
	const prevRef = useRef({ value, contextKey });

	useEffect(() => {
		const prev = prevRef.current;
		prevRef.current = { value, contextKey };

		if (prev.contextKey !== contextKey || prev.value === value) return;

		setIsFlashing(true);
		const timer = setTimeout(() => setIsFlashing(false), FLASH_MS);
		return () => clearTimeout(timer);
	}, [value, contextKey]);

	return isFlashing;
}

export default useFlashOnChange;
