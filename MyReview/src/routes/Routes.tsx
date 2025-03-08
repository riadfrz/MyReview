// src/Routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";



const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page Route */}
      <Route path="/" element={<LandingPage />} />

      {/* Redirect all other routes to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
