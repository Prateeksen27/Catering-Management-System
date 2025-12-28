import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";


const ProtectedRoute = ({ children,allowedRoles }) => {
  const { isAuthenticated,user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  const type = user?.empType.toUpperCase();
  if(allowedRoles && !allowedRoles.includes(type)){
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default ProtectedRoute;
