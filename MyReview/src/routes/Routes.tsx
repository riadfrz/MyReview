// src/Routes.tsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page Route */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Other Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRoutes;
