const sendSuccess = (message, data) => {
  return {
    success: true,
    message,
    data,
  };
};

const sendError = (message, error) => {
  return {
    success: false,
    message,
    error,
  };
};

module.exports = {
    sendSuccess,
    sendError
}