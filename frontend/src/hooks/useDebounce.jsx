// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Debounces a value by the given delay (ms).
 * Example: useDebounce(searchTerm, 500)
 */
export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup if value or delay changes
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
