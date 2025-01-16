import jwt from "jsonwebtoken";

const verifyJwt = async (req, res, next) => {
  try {
    console.log("Verifying JWT");

    // Ensure that cookie-parser middleware is in use
    if (!req.cookies) {
      return res.status(400).json({ message: "Cookies are not available" });
    }

    // Get the token from the auth_token cookie
    const authToken = req.cookies["auth_token"]; // Access the 'auth_token' cookie directly
    console.log("Auth token:", authToken);

    if (!authToken) {
      return res.status(401).json({ message: "Authorization token is missing" });
    }

    // Verify the JWT
    const decodedToken = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.log("Decoded token:", decodedToken);

    // Check if the user has admin privileges
    if (!decodedToken.isAdmin) {
      return res.status(403).json({ message: "Access denied, admin only" });
    }

    // Attach the user data to the request object for further use
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default verifyJwt;