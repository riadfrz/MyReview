// src/Routes.tsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import Dashboard from "../pages/Dashboard";
import RestaurantSetup from "../pages/RestaurantSetup";
import VerifyEmail from "../pages/VerifyEmail";
import ReviewWizard from "../pages/[ZKReview]/review-wizard";
import Callback from "../pages/auth/Callback";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page Route */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/auth/callback" element={<Callback />} />

      {/* Other Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/restaurant" element={<RestaurantSetup />} />
      <Route path="/verifyEmail" element={<VerifyEmail />} />

      <Route path="/[ZKReview]/review-wizard" element={<ReviewWizard />} />
    </Routes>
  );
};

export default AppRoutes;
