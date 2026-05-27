import { useState, useCallback, useEffect, useRef } from 'react';

export const useClipboard = ({ timeout = 2000 } = {}) => {
    const [hasCopied, setHasCopied] = useState(false);
    const timerRef = useRef(null);

    const onCopy = useCallback((value) => {
        const handleCopy = async () => {
            try {
                if (navigator?.clipboard?.writeText) {
                    await navigator.clipboard.writeText(value);
                    setHasCopied(true);

                    // Clear previous timer
                    if (timerRef.current) clearTimeout(timerRef.current);
                    timerRef.current = setTimeout(() => setHasCopied(false), timeout);
                } else {
                    throw new Error('Clipboard not supported');
                }
            } catch (error) {
                console.error('Failed to copyText: ', error);
                setHasCopied(false);
            }
        };

        handleCopy();
    }, [timeout]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return { onCopy, hasCopied, setValue: onCopy };
};

export default useClipboard;
