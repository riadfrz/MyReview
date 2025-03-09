import { useState } from 'react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../../components/ui/use-toast';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ForgotPassword = () => {
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Send password reset email with Supabase Auth
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) throw resetError;

      setSuccess(true);
      toast({
        title: 'Email sent!',
        description: 'Check your email for the password reset link.',
        duration: 3000,
      });
    } catch (err: unknown) {
      console.error('Password reset error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send password reset email. Please try again.'
      );
    } finally {
      setIsLoading(false);
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
          <CardHeader className="space-y-1 pb-8">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Reset Password
                </CardTitle>
              </motion.div>
              <Link
                to="/signin"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                Back to sign in
              </Link>
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>

          {success ? (
            <CardContent className="space-y-6">
              <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                <p className="font-medium">Reset link sent!</p>
                <p className="text-sm mt-1">
                  Check your email for instructions to reset your password.
                </p>
              </div>
              <div className="text-center">
                <Link
                  to="/signin"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium hover:underline">
                  Return to Sign In
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="transition-shadow duration-200 focus:shadow-md"
                  />
                </motion.div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {error}
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading}>
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </motion.div>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
