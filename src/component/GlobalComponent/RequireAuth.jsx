// RequireAuth.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const RequireAuth = ({ allowedRoles }) => {
  
  const location = useLocation();
  const { isAuthenticated, accessToken, user, loading } = useAuth();
  
  if (loading) return null; // or spinner
  
  // Check if user is authenticated (has access token)
  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  // if allowedRoles is passed, check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {    
    // Get user roles from the user object - roles should be directly on user
    const userRoles = user?.roles || [];
    
    // Check if user has any of the allowed roles
    const hasRequiredRole = allowedRoles.some(role => {
      // Check both exact match and case-insensitive match
      return userRoles.includes(role) || 
             userRoles.includes(role.toUpperCase()) || 
             userRoles.includes(role.toLowerCase());
    });
    
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    } 
  }

  return <Outlet />;
};

export default RequireAuth;