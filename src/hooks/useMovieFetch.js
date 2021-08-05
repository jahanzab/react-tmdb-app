
//Note: this is a custom hook, as recommended by React team always name your custom hook start with prefix 'use' as shown here useMovieFetch

import { isPersistedState } from '../helpers';
import { useState, useEffect, useRef, useCallback } from 'react';

//API
import API from '../API';

export const useMovieFetch = movieId => {

    const [state, setState] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // use useCallback to eliminate the infinte render loop
    const fetchMovie = useCallback(async () => {

        try {
            setLoading(true);
            setError(false);

            const movie = await API.fetchMovie(movieId);
            const credits = await API.fetchCredits(movieId);
            //Get drirectors only
            const directors = credits.crew.filter((item) => {
                return item.job === 'Director';
            });

            setState({
                ...movie,
                actors: credits.cast,
                directors
            });

            setLoading(false);

        } catch (error) {
            setError(true);
        }
    }, [movieId]);

    useEffect(() => {

        const sessionState = isPersistedState(movieId);
        if (sessionState) {
            setState(sessionState);
            setLoading(false);
            return;
        }
        fetchMovie();

    }, [movieId, fetchMovie]);

    //Write to sessionStorage
    useEffect(() => {

        sessionStorage.setItem(movieId, JSON.stringify(state));
    }, [movieId, state]);

    return { state, loading, error };
}