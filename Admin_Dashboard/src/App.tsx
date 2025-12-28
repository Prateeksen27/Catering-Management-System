import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import BookingInquire from "./pages/bookings/BookingInquire";
import BookingBooked from "./pages/bookings/BookingBooked";
import BookingPending from "./pages/bookings/BookingPending";
import BookingCompleted from "./pages/bookings/BookingCompleted";
import Calendar from "./pages/Calendar";
import Employees from "./pages/Employees";
import Menu from "./pages/Menu";
import AssignedWord from "./pages/AssignedWord";
import Store from "./pages/Store";
import Tables from "./pages/Tables";
import NotFound from "./pages/NotFound";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import SignInPage from "./pages/AuthPages/SignInPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";
import EmployeeProfile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Vehicle from "./pages/Vehicle";
import AssignedEvents from "./pages/AssignedEvents";
import Inventory from "./pages/Inventory";
import RoleDashboardRedirect from "./pages/RoleDashboardRedirect";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <BrowserRouter>
          <Routes>

            {/* Root redirect */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "CHEF", "WORKER", "DRIVER"]}>
                  <DashboardLayout>
                    <RoleDashboardRedirect />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Dashboards */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <DashboardLayout><Dashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/manager" element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <DashboardLayout><Dashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/chef" element={
              <ProtectedRoute allowedRoles={["CHEF"]}>
                <DashboardLayout><Dashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/worker" element={
              <ProtectedRoute allowedRoles={["WORKER"]}>
                <DashboardLayout><Dashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/driver" element={
              <ProtectedRoute allowedRoles={["DRIVER"]}>
                <DashboardLayout><Dashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Bookings */}
            <Route path="/bookings/inquire" element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                <DashboardLayout><BookingInquire /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/bookings/booked" element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "CHEF", "WORKER", "DRIVER"]}>
                <DashboardLayout><BookingBooked /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/bookings/pending" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <DashboardLayout><BookingPending /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/bookings/completed" element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                <DashboardLayout><BookingCompleted /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Common */}
            <Route path="/calendar" element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "CHEF", "WORKER", "DRIVER"]}>
                <DashboardLayout><Calendar /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/employees" element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                <DashboardLayout><Employees /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/menu" element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "CHEF"]}>
                <DashboardLayout><Menu /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/assigned-word" element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "CHEF", "WORKER", "DRIVER"]}>
                <DashboardLayout><AssignedWord /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/assigned-events" element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                <DashboardLayout><AssignedEvents /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/store" element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "WORKER"]}>
                <DashboardLayout><Store /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/inventory" element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "CHEF"]}>
                <DashboardLayout><Inventory /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/vehicles" element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "DRIVER"]}>
                <DashboardLayout><Vehicle /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Profile */}
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "CHEF", "WORKER", "DRIVER"]}>
                <DashboardLayout><EmployeeProfile /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/userProfile" element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                <DashboardLayout><UserProfile /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Login */}
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <SignInPage />}
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "CHEF", "WORKER", "DRIVER"]}>
                  <DashboardLayout><NotFound /></DashboardLayout>
                </ProtectedRoute>
              }
            />
            {/* Unauthorized */}
            <Route path='/unauthorized'
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "CHEF", "WORKER", "DRIVER"]}>
                  <DashboardLayout>
                    <Unauthorized />
                  </DashboardLayout>
                </ProtectedRoute>

              } />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default App;
