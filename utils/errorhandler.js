const errorHandler = (err, req, res) => {
  if (err.statusCode) {
    // if error has user-defined statusCode then it's a custom error
    res.status(err.statusCode).json({
      status: "error",
      error: err.message,
      data: err.data,
    });
    // if error has system-generated status
  } else if (err.status) {
    res.status(err.status).json({
      status: "error",
      error: err.message,
      data: [], // no data to return
    });
    // if this is an unknown/uncaught error
  } else {
    res.status(500).json({
      status: "error",
      error: "Internal server error",
      data: [], // no data to return
    });
    //we want to see the actual error
    console.log(err.message);
  }
};

module.exports = errorHandler;
