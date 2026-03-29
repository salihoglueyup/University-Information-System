import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
    const getMatches = () => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(query).matches;
    };

    const [matches, setMatches] = useState(getMatches);

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = (event) => setMatches(event.matches);

        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
};

export default useMediaQuery;
