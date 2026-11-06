import { getCurrentUser } from "../../services/api/authService.js";
import NotFound from "../../pages/NotFound/NotFound.jsx";

function AdminRoute({ children }) {
    const user = getCurrentUser();

    if (!user || user.role !== "Admin") {
        return <NotFound />;
    }

    return children;
}

export default AdminRoute;