/**
 * Pagination helper to compute skip, limit, and pagination metadata.
 * 
 * Concept:
 * MongoDB uses .skip(skip) and .limit(limit) to slice query results.
 * This helper calculates the page offset and generates total page counts.
 * 
 * @param {object} query - Express req.query object
 * @param {number} defaultLimit - Default items per page
 * @returns {object} - { page, limit, skip, getPaginationMetadata }
 */
const getPagination = (query, defaultLimit = 10) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || defaultLimit));
  const skip = (page - 1) * limit;

  const getPaginationMetadata = (totalItems) => {
    const totalPages = Math.ceil(totalItems / limit) || 1;
    return {
      currentPage: page,
      totalPages,
      totalItems,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  };

  return { page, limit, skip, getPaginationMetadata };
};

module.exports = { getPagination };
