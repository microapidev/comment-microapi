module.exports = (res, status, data, message) => {
  res.status(status).json({
    data,
    status: "success",
    message,
  });
};
