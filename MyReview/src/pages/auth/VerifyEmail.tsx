import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  const { toast } = useToast();

  useEffect(() => {
    if (resendDisabled) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendDisabled]);

  // In your VerifyEmail.tsx, modify the handleResendEmail function:

  const handleResendEmail = async () => {
    try {
      // Use the fully qualified URL with http/https
      const fullOrigin = window.location.origin; // e.g., http://localhost:5173
      const redirectUrl = `${fullOrigin}/auth/callback`;

      console.log('Using redirect URL for resend:', redirectUrl);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox for the verification link',
        duration: 3000,
      });

      setResendDisabled(true);
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast({
        title: 'Error sending email',
        description:
          'There was a problem sending the verification email. Please try again.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md">
        <Card className="shadow-xl border-slate-200 dark:border-slate-700">
          <CardHeader className="space-y-1 items-center text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
              <Mail size={32} className="text-blue-600 dark:text-blue-300" />
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              We&apos;ve sent a verification email to{' '}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {email}
              </span>
              . Please check your inbox and click the verification link to
              continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start space-x-3">
                <CheckCircle2
                  className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0"
                  size={18}
                />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-medium mb-1">After verification:</p>
                  <p>
                    You&apos;ll be able to log in and add your restaurant
                    details to complete your profile.
                  </p>
                </div>
              </div>
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              onClick={handleResendEmail}
              variant="outline"
              className="w-full border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              disabled={resendDisabled}>
              {resendDisabled
                ? `Resend email (${countdown}s)`
                : "Didn't receive the email? Resend"}
            </Button>

            <div className="text-sm text-center text-slate-600 dark:text-slate-400">
              Already verified?{' '}
              <Link
                to="/signin"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
