import { Navigate } from "react-router-dom";

/**
 * Route protection wrapper:
 * - Redirects unauthenticated users to /login.
 * - Redirects unauthorized roles (e.g. students trying to access admin pages) to their appropriate dashboard.
 * - Safely handles missing or malformed localStorage user data.
 */
function ProtectedRoute({ children, requiredRole }) {
    const token = localStorage.getItem("token");

    let user = null;
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch {
        user = null;
    }

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return (
            <Navigate
                to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;
