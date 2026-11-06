import { Navigate } from "react-router-dom";
import { getCurrentUser, getToken } from "../../services/api/authService.js";
import NotFound from "../../pages/NotFound/NotFound.jsx";

function AccountRoute({ children }) {
    const user = getCurrentUser();

    if (!user) {
        return <NotFound/>;
    }

    const token = getToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default AccountRoute;