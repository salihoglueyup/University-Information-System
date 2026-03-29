/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';

const Confetti = ({ trigger, options = {} }) => {

    const fire = useCallback(() => {
        const defaults = {
            origin: { y: 0.7 },
            zIndex: 9999,
        };

        confetti({
            ...defaults,
            ...options,
        });
    }, [options]);

    useEffect(() => {
        if (trigger) {
            fire();
        }
    }, [trigger, fire]);

    return null; // This is a utility component, renders nothing
};

// Export a standalone function as well for imperative use
export const triggerConfetti = (opts) => {
    confetti({
        origin: { y: 0.7 },
        zIndex: 9999,
        ...opts
    });
};

export default Confetti;
