import { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '../components/ui/use-toast';
import { Building2, MapPin, Star } from 'lucide-react';

interface RestaurantFormData {
  name: string;
  address: string;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const RestaurantSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('You must be logged in to add a restaurant');
      }

      // Use RPC for inserting restaurant (bypassing RLS issues)
      // This calls a server-side function that has higher privileges
      const { error: insertError } = await supabase.rpc('create_restaurant', {
        restaurant_name: formData.name,
        restaurant_address: formData.address,
      });

      if (insertError) throw insertError;

      toast({
        title: 'Restaurant added!',
        description: 'Your restaurant profile has been created successfully.',
        duration: 5000,
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Error setting up restaurant:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to set up restaurant. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            <div className="flex flex-col items-center text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mb-3">
                <Building2
                  size={32}
                  className="text-teal-600 dark:text-teal-300"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Add Your Restaurant
                </CardTitle>
              </motion.div>
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Complete your profile by adding your restaurant details
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium flex items-center gap-2">
                  <Star size={16} className="text-amber-500" />
                  Restaurant Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. The Hungry Chef"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="transition-shadow duration-200 focus:shadow-md"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium flex items-center gap-2">
                  <MapPin size={16} className="text-red-500" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="e.g. 123 Main Street, New York, NY 10001"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="min-h-[100px] transition-shadow duration-200 focus:shadow-md"
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
                    <span>Saving...</span>
                  </motion.div>
                ) : (
                  'Complete Setup'
                )}
              </Button>

              <div className="text-sm text-center text-slate-600 dark:text-slate-400">
                Not ready yet?{' '}
                <Link
                  to="/dashboard"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium hover:underline">
                  Skip for now
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default RestaurantSetup;
