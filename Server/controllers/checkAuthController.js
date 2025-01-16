
import jwt from 'jsonwebtoken';

const checkAuthController = (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ isAuthenticated: false });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ isAuthenticated: true });
    } catch {
        return res.status(401).json({ isAuthenticated: false });
    }
}

export default checkAuthController;