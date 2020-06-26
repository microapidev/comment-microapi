export default (res, status, data, message) => {
  res.status(status).json({
    data,
    status: "success",
    message,
  });
};
