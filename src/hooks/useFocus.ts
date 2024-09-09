import { useRef, useCallback } from 'react';

// Define the type for the returned value
type UseFocusReturn<T extends HTMLElement> = [React.RefObject<T>, () => void];

// This hook help focus on input after you do any action if you want!
function useFocus<T extends HTMLElement = HTMLInputElement>(): UseFocusReturn<T> {
	const inputRef = useRef<T>(null);

	const setFocus = useCallback(() => {
		const timeId = setTimeout(() => {
			if (!inputRef.current) {
				return;
			}

			inputRef.current.focus();
		}, 100);

		return () => clearTimeout(timeId);
	}, [inputRef]);

	return [inputRef, setFocus];
}
export default useFocus;
