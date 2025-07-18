import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import api from '../services/api.js'; // Ensure this path is correct
import toast from 'react-hot-toast';

const ProtectedRoute = ({ allowedRoles, loginPath }) => { // ADDED: loginPath prop
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Step 1: Make a request to the generic protected endpoint (/users/me)
        // This endpoint should verify the token and return the user's role.
        const response = await api.get('/users/me', { withCredentials: true }); 
        
        if (response.status === 200 && response.data) {
          const fetchedRole = response.data.role; // Get the user's role from the response

          // Step 2: Check if the fetched role is allowed for *this* route (based on allowedRoles prop)
          if (allowedRoles.includes(fetchedRole)) {
            setIsAuthenticated(true);
          } else {
            // User is authenticated but NOT authorized for THIS specific route
            toast.error(`Access denied. You are a ${fetchedRole}, not authorized for this page.`);
            
            // Redirect to their OWN dashboard if they are logged in but tried to access the wrong role's page
            if (fetchedRole === 'admin') {
              navigate('/admin-dashboard'); 
            } else if (fetchedRole === 'client') {
              navigate('/show-question'); // Or their main client dashboard
            } else if (fetchedRole === 'organizer') {
              navigate('/create-quiz'); // Or their main organizer dashboard
            } else {
              navigate('/'); // Default to home if role is unknown or not handled
            }
          }
        } else {
          // This case should ideally not happen if the backend always returns 401/403 for unauthorized
          // but included for robustness if a 200 comes with empty/bad data.
          toast.error("Authentication failed: Invalid response.");
          navigate(loginPath); // Redirect to the specified login page
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Handle common unauthorized/forbidden errors
        if (error.response?.status === 401) { // Unauthenticated (no token or invalid token)
          toast.error('Session expired. Please log in.');
          navigate(loginPath); // REDIRECT to the login page specified by prop
        } else if (error.response?.status === 403) { // Authenticated but Forbidden (role not allowed by backend)
          toast.error('Unauthorized access. Redirecting.');
          // If the backend /users/me endpoint itself returns 403 for some roles,
          // this indicates the role isn't allowed even to fetch basic info.
          // In this scenario, we don't know their role, so redirect to specified login path.
          navigate(loginPath); 
        } else { // Other network errors, server errors, etc.
          toast.error('An unexpected error occurred during authentication. Please try again.');
          navigate(loginPath); // Fallback redirect for other errors
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, allowedRoles, loginPath]); // ADDED loginPath to dependency array

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-white text-2xl">Verifying access...</div>;
  }

  // Render children (Outlet) if authenticated and authorized, otherwise null (handled by navigate)
  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;