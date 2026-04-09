// import { Navigate } from "react-router-dom";
// import { useAuthStore } from "../../store/useAuthStore";


// const ProtectedRoute = ({ children,allowedRoles }) => {
//   const { isAuthenticated,user } = useAuthStore();
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   const type = user?.empType.toUpperCase();
//   if(allowedRoles && !allowedRoles.includes(type)){
//     return <Navigate to="/unauthorized" replace />;
//   }
//   return children;
// };

// export default ProtectedRoute;
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const ProtectedRoute = ({ children, allowedRoles }) => {
const { isAuthenticated, user, isLoading } = useAuthStore();

// Wait until auth state is loaded
if (isLoading) {
return ( <div className="flex items-center justify-center h-screen"> <p className="text-gray-500 text-lg">Checking authentication...</p> </div>
);
}

// Not logged in
if (!isAuthenticated) {
return <Navigate to="/login" replace />;
}

// Safe role check
console.log("User ",user);

const role = user?.empType?.toUpperCase();

if (allowedRoles && !allowedRoles.includes(role)) {
return <Navigate to="/unauthorized" replace />;
}

return children;
};

export default ProtectedRoute;
