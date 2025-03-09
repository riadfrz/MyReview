import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from the URL
        const code = searchParams.get('code');

        if (code) {
          // Exchange the code for a session
          const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (sessionError) {
            throw sessionError;
          }

          // Check if the user is authenticated
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            // Redirect to dashboard on successful authentication
            navigate('/dashboard');
          } else {
            // If no session, redirect to sign in
            navigate('/signin');
          }
        } else {
          // If no code is present, redirect to sign in
          navigate('/signin');
        }
      } catch (err) {
        console.error('Error during authentication callback:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        // Redirect to sign in after a short delay
        setTimeout(() => navigate('/signin'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-slate-200 dark:border-slate-700">
          <CardHeader className="space-y-1 pb-4 text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              {error ? 'Authentication Error' : 'Authenticating...'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            {error ? (
              <div className="text-red-500 dark:text-red-400 text-center">
                <p>{error}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Redirecting you to sign in page...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  Completing your authentication...
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