const logout = (req, res) => {
    try {
      // Clear the 'auth_token' cookie
      res.clearCookie('auth_token', {
        httpOnly: true, // Ensures cookie is only accessible by the server
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict', // Prevent CSRF attacks
      });
  
      console.log("User logged out successfully");
      
      // Send a success response
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      // Handle unexpected errors
      console.error("Error during logout:", error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export default logout;