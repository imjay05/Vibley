import Navbar from "./components/Navbar";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/signup/SignupPage";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/Profilepage";
import VibePage from "./pages/vibe/VibePage";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const AUTH_ROUTES = ["/login", "/signup"];

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  const hideNavbar = AUTH_ROUTES.includes(location.pathname);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    checkAuth();
  }, []);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader className="size-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/"        element={authUser ? <HomePage />    : <Navigate to="/login" />} />
        <Route path="/signup"  element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login"   element={!authUser ? <LoginPage />  : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/vibes"   element={authUser ? <VibePage />    : <Navigate to="/login" />} />
      </Routes>
      <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
    </div>
  );
};

export default App;