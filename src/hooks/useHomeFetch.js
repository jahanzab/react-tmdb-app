
//Note: this is a custom hook, as recommended by React team always name your custom hook start with prefix 'use' as shown here useHomeFetch

import { isPersistedState } from '../helpers';

import { useState, useEffect, useRef } from 'react';

//API
import API from '../API';

const initialState = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0
}

export const useHomeFetch = () => {

    const HOME_STATE = 'homeState';

    const [searchTerm, setSearchTerm] = useState('');
    const [state, setState] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const fetchMovies = async (page, searchTerm = "") => {

        try {
            setError(false);
            setLoading(true);

            const movies = await API.fetchMovies(searchTerm, page);

            setState(prev => ({
                ...movies,
                results:
                    page > 1 ? [...prev.results, ...movies.results] : [...movies.results]
            }))

        } catch (error) {
            setError(true);
        }

        setLoading(false);

    }

    // Initial and search
    useEffect(() => {

        if (!searchTerm) {
            const sessionState = isPersistedState(HOME_STATE);

            if (sessionState) {
                setState(sessionState);
                return;
            }
        }
        //clear the state
        setState(initialState);

        fetchMovies(1, searchTerm);
    }, [searchTerm]);

    // Load More
    useEffect(() => {

        if (!isLoadingMore) return;

        fetchMovies(state.page + 1, searchTerm)

        setIsLoadingMore(false);

    }, [isLoadingMore, searchTerm, state.page]);

    //Write to sessionStorage
    useEffect(() => {

        if (!searchTerm) sessionStorage.setItem(HOME_STATE, JSON.stringify(state));
    }, [searchTerm, state]);

    return { state, loading, error, setSearchTerm, searchTerm, setIsLoadingMore };
}