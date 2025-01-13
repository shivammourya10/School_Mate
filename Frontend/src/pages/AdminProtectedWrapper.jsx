import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminProtectedWrapper = () => {
    const token = localStorage.getItem('auth_token');
    const navigate = useNavigate();
   
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/admin-signin');
            return;
        }
        else{
            navigate('/admin-homepage');
        }

    }, [token, navigate]);


    return isAuthenticated ? <Outlet /> : null;
};

export default AdminProtectedWrapper;