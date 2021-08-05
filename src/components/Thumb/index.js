import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//Styles
import { Image } from './Thumb.styles';

const Thumb = ({ image, movieId, clickable, isAdjustHeigth }) => (
    <div>
        {clickable ? (
            <Link to={`/${movieId}`}>
                <Image isAdjustHeigth={isAdjustHeigth} src={image} alt='movie-thumb' />
            </Link>
        ) : (
            <Image isAdjustHeigth={isAdjustHeigth} src={image} alt='movie-thumb' />
        )}
    </div>
)

Thumb.propTypes = {
    image: PropTypes.string,
    movieId: PropTypes.number,
    clickable: PropTypes.bool,
    isAdjustHeigth: PropTypes.bool
}

export default Thumb;