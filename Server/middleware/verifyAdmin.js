import jwt from "jsonwebtoken";

const verifyJwt = async (req, res, next) => {
    try {
        console.log("first")
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization("auth_token");
        console.log("hello snijv ",authHeader)
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization header is missing or improperly formatted" });
        }

        const token = authHeader.replace("Bearer ", "");
        console.log("hello2")
        // Verify the JWT
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid token" });
        }
        console.log(decodedToken);
        // Check if the user has admin privileges
        if (!decodedToken.isAdmin) {
            return res.status(403).json({ message: "Access denied, admin only" });
        }
        console.log("Hello")
        // Attach the user data to the request object for further use
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Error verifying JWT:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export default verifyJwt;