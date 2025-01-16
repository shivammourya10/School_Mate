const logoutController = (req, res) => {
    // Clear the cookie storing the authentication token
    res.clearCookie('auth_token', {
      httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
      sameSite: 'Strict', // Helps prevent CSRF attacks
    });
  
    // Respond with a success message
    res.status(200).json({ message: 'Logout successful' });
  };
  
  export default logoutController;
  