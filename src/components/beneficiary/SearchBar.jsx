import React from 'react';
import PropTypes from 'prop-types';

/**
 * Search input component.
 *
 * Allows the user to type a search query and updates the parent state via setQuery.
 *
 * @component
 * @param {Object} props
 * @param {string} props.query - Current value of the search input
 * @param {function} props.setQuery - Function to update the query in the parent component
 */
export default function SearchBar({ query, setQuery }) {
    return (
        <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher..."
        />
    );
}

SearchBar.propTypes = {
    query: PropTypes.string.isRequired,
    setQuery: PropTypes.func.isRequired,
};
