// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
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
const queryClient = new QueryClient();

const App = () => {
  const {isAuthenticated} = useAuthStore()
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        {/* <TooltipProvider> */}
        {/* <Toaster /> */}
        {/* <Sonner /> */}
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/bookings/inquire" element={
              <ProtectedRoute>
              <DashboardLayout>
                <BookingInquire />
              </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/bookings/booked" element={
              <ProtectedRoute>
              <DashboardLayout>
                <BookingBooked />
              </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/bookings/pending" element={
              <ProtectedRoute>
              <DashboardLayout>
                <BookingPending />
              </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/bookings/completed" element={

              <ProtectedRoute>
              <DashboardLayout>
                <BookingCompleted />
              </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/bookings" element={
              <ProtectedRoute>
              <DashboardLayout>
                <BookingInquire />
              </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
              <DashboardLayout>
                <Calendar />
              </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/employees" element={
              <ProtectedRoute>
              <DashboardLayout>
                <Employees />
              </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/menu" element={
              <ProtectedRoute>
              <DashboardLayout>
                <Menu />
              </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/assigned-word" element={
              <ProtectedRoute>
              <DashboardLayout>
                <AssignedWord />
              </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/store" element={
              <ProtectedRoute>
              <DashboardLayout>
                <Store />
              </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/tables" element={
              <ProtectedRoute>
              <DashboardLayout>
                <Tables />
              </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
              <DashboardLayout>
                <EmployeeProfile />
              </DashboardLayout>
              </ProtectedRoute>
            }
            />
            <Route path='/login' element={
              isAuthenticated?
               <Navigate to="/"  />:
              <SignInPage />
             
              
              } />
            <Route path="*" element={
              <ProtectedRoute>
              <DashboardLayout>
                <NotFound />
              </DashboardLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
        {/* </TooltipProvider> */}
      </QueryClientProvider>
    </MantineProvider>
  )
}

export default App;
