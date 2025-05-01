/**
 * Helper function to extract pagination parameters from request query
 */
export const getPaginationParams = (query: any) => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const sortBy = query.sortBy as string || 'createdAt';
  const sortOrder = (query.sortOrder as string || 'desc').toUpperCase();

  return {
    page,
    limit,
    offset,
    sortBy,
    sortOrder,
  };
};
