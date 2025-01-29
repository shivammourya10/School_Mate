// Central error handling middleware
const errorHandlingMiddleware = (err, _, res, next) => {
  if (err.code === "FILE_FILTER_ERROR") {
    // Handle Multer-specific errors
    res.status(400).json({ message: err.message });
    next();
  } else {
    // Handle other errors
    console.error("Got a random error");
    res.status(500).json({ message: "Something went wrong with the server" });
    next();
  }
};

export default errorHandlingMiddleware;
