"use client";

import { Navigate, Route, Routes } from "react-router-dom";

import SignUpPage from "./signup/SignUpPage";
import LoginPage from "./login/LoginPage";
import ForgotPasswordPage from "./forgot-password/ForgotPasswordPage";
import ResetPasswordPage from "./reset-password/ResetPasswordPage";
import HomePage from "./profile/ProfilePage";

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect, ReactNode } from "react";

// Props for route guards
interface RouteGuardProps {
  children: ReactNode;
}

// protect routes that require authentication
const ProtectedRoute = ({ children }: RouteGuardProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }: RouteGuardProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='/login'
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='/reset-password/:token'
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        {/* catch-all route */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
