import React, { useState, useEffect, useCallback, ChangeEvent, useRef } from 'react';

export const SearchComponent: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(event.target.value);
    }, [setSearchTerm]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            return;
        }

        const timer = window.setTimeout(() => {
            // request data from the back end, pass the `value` as a parameter
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm]);

    return <div>
        <input
            type="text"
            value={searchTerm}
            onChange={handleChange}/>
    </div>;
};