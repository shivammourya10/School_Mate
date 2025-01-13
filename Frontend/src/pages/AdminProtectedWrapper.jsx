import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminProtectedWrapper = () => {
    const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Loading state to avoid premature rendering
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                // No token found, redirect to sign-in page
                navigate('/admin-signin');
                return;
            }

            try {
                // Validate token by making an API request
                console.log(token);
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/admin/validate-token`,
                    {}, // Add payload if required by your API
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Attach token in Authorization header
                        },
                    }
                );

                if (response.status === 200) {
                    // Token is valid, redirect to homepage
                    setIsAuthenticated(true);
                    navigate('/admin-homepage');
                }
            } catch (error) {
                // Token validation failed, redirect to sign-in page
                console.error('Error validating token:', error.response?.data || error.message);
                localStorage.removeItem('auth_token'); // Clear invalid token
                navigate('/admin-signin');
            } finally {
                setIsLoading(false); // Stop loading once the validation is complete
            }
        };

        validateToken();
    }, [token, navigate]);

    if (isLoading) {
        // Show a loading spinner or placeholder while validation is in progress
        return <div>Loading...</div>;
    }

    // Render protected routes if authenticated
    return isAuthenticated ? <Outlet /> : null;
};

export default AdminProtectedWrapper;