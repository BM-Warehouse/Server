function successResponse(data, message) {
  return {
    status: 'success',
    message,
    data,
  };
}

module.exports = {
  successResponse,
};
