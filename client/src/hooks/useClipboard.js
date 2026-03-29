import { useState, useCallback } from 'react';

export const useClipboard = ({ timeout = 2000 } = {}) => {
    const [hasCopied, setHasCopied] = useState(false);

    const onCopy = useCallback((value) => {
        const handleCopy = async () => {
            try {
                if (navigator?.clipboard?.writeText) {
                    await navigator.clipboard.writeText(value);
                    setHasCopied(true);
                } else {
                    throw new Error('Clipboard not supported');
                }
            } catch (error) {
                // Fallback or error handling
                console.error('Failed to copyText: ', error);
                setHasCopied(false);
            }
        };

        handleCopy();
    }, []);

    // Reset after timeout
    if (hasCopied) {
        setTimeout(() => setHasCopied(false), timeout);
    }

    return { onCopy, hasCopied, setValue: onCopy };
};

export default useClipboard;
