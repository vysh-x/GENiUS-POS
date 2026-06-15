/**
 * Validates if the string contains only alphanumeric characters (a-z, A-Z, 0-9).
 * @param {string} value - The string to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
export const isAlphanumeric = (value) => {
    const regex = /^[a-zA-Z0-9]*$/;
    return regex.test(value);
};

/**
 * Filters a string to return only alphanumeric characters.
 * @param {string} value - The string to filter.
 * @returns {string} - The filtered string.
 */
export const filterAlphanumeric = (value) => {
    return value.replace(/[^a-zA-Z0-9]/g, '');
};
