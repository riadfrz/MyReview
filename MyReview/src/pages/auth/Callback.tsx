import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../components/ui/card';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/button';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Callback = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string>(
    'Checking authentication status...'
  );

  useEffect(() => {
    const checkSession = async () => {
      try {
        // First try to see if we're already authenticated
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session check error:', sessionError);
          throw sessionError;
        }

        // If we have a session, we're already authenticated
        if (session) {
          console.log('User is already authenticated:', session.user.id);
          setMessage('You are authenticated! Redirecting to setup page...');

          // Redirect to restaurant setup after a short delay
          setTimeout(() => {
            navigate('/restaurant');
          }, 1500);
          return;
        }

        // No session yet, check URL parameters for auth info
        processUrlParams();
      } catch (err) {
        console.error('Error in auth flow:', err);
        setError(
          err instanceof Error ? err.message : 'Authentication check failed'
        );
      }
    };

    const processUrlParams = () => {
      // Collect debug info
      const fullUrl = window.location.href;
      const urlPath = window.location.pathname;
      const urlSearch = window.location.search;
      const urlHash = window.location.hash;

      console.log('==== AUTH CALLBACK DEBUG ====');
      console.log('Full URL:', fullUrl);
      console.log('URL Path:', urlPath);
      console.log('URL Search:', urlSearch);
      console.log('URL Hash:', urlHash);

      setDebugInfo({
        fullUrl,
        urlPath,
        urlSearch,
        urlHash,
      });

      // Check for type/token combo which indicates magic link flow
      const type = searchParams.get('type');
      const accessToken = searchParams.get('access_token');

      // For magic links or social auth
      if (
        (type && (type === 'recovery' || type === 'magiclink')) ||
        accessToken
      ) {
        console.log('Processing magic link or token auth');
        setMessage('Processing your authentication...');

        // The session will be automatically created by Supabase's JS client
        // Just delay and check for session again
        setTimeout(() => {
          checkForSession();
        }, 1000);
        return;
      }

      // Check for email confirmation flow with fragment
      if (urlHash && urlHash.includes('access_token')) {
        console.log('Found tokens in hash');
        setMessage('Processing authentication from hash...');

        // The session should be automatically created
        setTimeout(() => {
          checkForSession();
        }, 1000);
        return;
      }

      // Handle standard email confirmation flow
      const code = searchParams.get('code');
      if (code) {
        console.log('Found auth code in URL');
        handleAuthCode(code);
        return;
      }

      // No authentication information found
      setError(
        'No authentication information found. Please try signing up again.'
      );
    };

    const checkForSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          console.log('Session established after processing');
          setMessage('Authentication successful! Redirecting...');
          setTimeout(() => {
            navigate('/restaurant');
          }, 1000);
        } else {
          setError('Authentication processed but no session was established.');
        }
      } catch (err) {
        console.error('Session check error:', err);
        setError('Failed to verify your authentication status.');
      }
    };

    const handleAuthCode = async (code: string) => {
      try {
        setMessage('Processing verification code...');
        console.log('Exchanging code for session');

        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error('Code exchange error:', exchangeError);
          throw exchangeError;
        }

        // Check if session was established
        checkForSession();
      } catch (err) {
        console.error('Error in code exchange:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to process authentication code'
        );
      }
    };

    // Start the auth flow check
    checkSession();
  }, [location, searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md">
        <Card className="shadow-xl border-slate-200 dark:border-slate-700">
          <CardHeader className="space-y-1 pb-4 text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              {error ? 'Authentication Error' : 'Authentication'}
            </CardTitle>
            {error ? (
              <CardDescription className="text-slate-600 dark:text-slate-400">
                We encountered an issue with your authentication
              </CardDescription>
            ) : (
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Please wait while we complete your authentication
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            {error ? (
              <div className="flex flex-col items-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-amber-500" />
                <div className="text-center space-y-4">
                  <p className="text-red-500 dark:text-red-400">{error}</p>

                  <div className="pt-2">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full mb-2"
                      onClick={() => navigate('/signup')}>
                      Back to Sign Up
                    </Button>
                  </div>
                </div>

                {/* Debug information */}
                <div className="mt-6 w-full text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-[200px]">
                  <div className="font-bold mb-2">Debug Information:</div>
                  {Object.entries(debugInfo).map(([key, value]) => (
                    <div key={key} className="mb-1">
                      <span className="font-semibold">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  {message}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Callback;
