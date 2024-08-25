import { useSearchParams } from 'react-router-dom';

function useQueryParams() {
	const [searchParams, setSearchParams] = useSearchParams();

	const updateQueryParams = (params: Record<string, string | undefined | null>) => {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				searchParams.set(key, value);
			} else {
				searchParams.delete(key); // Remove the key if the value is undefined or null
			}
		});
		setSearchParams(searchParams);
	};

	return { params: searchParams, updateQueryParams };
}

export default useQueryParams;
