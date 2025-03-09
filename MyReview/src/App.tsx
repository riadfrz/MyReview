import { useEffect } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/Routes';

// This component handles redirects after page load
const RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for a stored redirect path
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      // Clear it immediately to prevent infinite loops
      sessionStorage.removeItem('redirectPath');

      // Special handling for auth/callback route
      if (redirectPath.includes('/auth/callback')) {
        console.log('Redirecting to auth callback route');
        navigate(redirectPath, { replace: true });
      } else {
        // Handle other routes
        navigate(redirectPath, { replace: true });
      }
    }
  }, [navigate]);

  return null;
};

// Main App component
function App() {
  return (
    <BrowserRouter>
      <RedirectHandler />
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
