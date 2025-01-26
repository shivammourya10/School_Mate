import jwt from "jsonwebtoken";

const verifyJwt = async (req, res, next) => {
    try {
        console.log("Step 1: Middleware execution started");

        // Get the token from cookies
        const authToken = req.cookies.auth_token;
        // Correct key name here
        console.log("Auth Token:", authToken);

        // Check if the token exists
        if (!authToken) {
            return res.status(401).json({ message: "Authentication token is missing" });
        }

        console.log("Step 2: Token received");

        // Verify the JWT
        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
        console.log("Decoded Token:", decodedToken);

        // Check if the user has admin privileges (if required)
        if (!decodedToken.isAdmin) {
            return res.status(403).json({ message: "Access denied, admin only" });
        }

        console.log("Step 3: Token successfully verified");

        // Attach the user data to the request object for further use
        req.user = decodedToken;

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("Error verifying JWT:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export default verifyJwt;