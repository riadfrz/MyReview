// src/Routes.tsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page Route */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Authentication Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

    </Routes>
  );
};

export default AppRoutes;
