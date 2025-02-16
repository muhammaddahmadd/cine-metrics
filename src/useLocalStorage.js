import { useState, useEffect } from "react";


export function useLocalStorage(initialState, key){
    const [value, setValue] = useState(() => {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : initialState
    });



    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue]
}