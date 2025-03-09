// src/Routes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import Dashboard from '../pages/Dashboard';
import RestaurantSetup from '../pages/RestaurantSetup';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ReviewWizard from '../pages/[ZKReview]/review-wizard';
import Callback from '../pages/auth/Callback';
import ReviewsPage from '../pages/ReviewsPage';
import VerifiedReviewPage from '../pages/VerifiedReview';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page Route */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/auth/callback" element={<Callback />} />
      <Route path="/verifyEmail" element={<VerifyEmail />} />

      {/* Other Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/restaurant" element={<RestaurantSetup />} />

      <Route path="/reviews" element={<ReviewsPage />} />

      {/* Verified Review Routes */}
      <Route
        path="/verified-review/:restaurantId"
        element={<VerifiedReviewPage />}
      />

      {/* <Route path="/[ZKReview]/review-wizard" element={<ReviewWizard />} /> */}

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
