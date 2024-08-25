import helpers from '@/utils/helpers';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useScrollToTop() {
	const location = useLocation();

	useEffect(() => {
		setTimeout(() => {
			helpers.scrollToTop();
		}, 100);
	}, [location.pathname]);

	return null;
}

export default useScrollToTop;
