exports.getPaginationStatus = (page, limit, totalData) => {
  const totalPage = Math.ceil(totalData / limit);
  const hasNextPage = page < totalPage;
  const hasPrevPage = page > 1;

  let prevPage = null;
  if (page > totalPage) {
    prevPage = totalPage;
  } else if (hasPrevPage) {
    prevPage = page - 1;
  }

  return {
    totalPage,
    totalData: totalData,
    nextPage: hasNextPage ? +page + 1 : null,
    prevPage,
    currentPage: +page,
    limit: +limit,
  };
};
