/**
 * Extracts a human-readable error message from an API error response.
 * Handles both standard string messages and Pydantic validation error arrays.
 * 
 * @param {Object} err - The error object from axios/api
 * @param {string} fallback - Fallback message if no detail is found
 * @returns {string} The error message
 */
export const getErrorMessage = (err, fallback = 'An unexpected error occurred') => {
    const detail = err.response?.data?.detail;

    if (typeof detail === 'string') {
        return detail;
    }

    if (Array.isArray(detail)) {
        // Pydantic validation error array
        // Each item looks like: { loc: [...], msg: "...", type: "..." }
        return detail.map(e => e.msg).join(', ');
    }

    return fallback;
};
