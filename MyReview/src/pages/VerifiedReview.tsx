import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ZkReviewForm from '../components/review/ZkReviewForm';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const VerifiedReviewPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, we would fetch restaurant details here
    // For now, we'll just simulate it
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // If we have a restaurantId, fetch details
        if (restaurantId) {
          setRestaurantName(`Restaurant #${restaurantId}`);
          setError(null);
        } else {
          setError('No restaurant ID provided');
        }
      } catch (err) {
        setError('Failed to load restaurant details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 text-center border border-slate-200 dark:border-slate-700">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-t-4 border-b-4 border-blue-600 dark:border-blue-400 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-700 dark:text-slate-300 text-lg font-medium">
            Loading restaurant details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !restaurantId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md">
          <Alert
            variant="destructive"
            className="mb-6 border border-red-200 dark:border-red-800 bg-white dark:bg-slate-800 shadow-lg">
            <AlertTitle className="text-red-800 dark:text-red-400 font-semibold text-lg">
              Error
            </AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">
              {error || 'No restaurant ID provided'}
            </AlertDescription>
          </Alert>
          <Button
            asChild
            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-md">
            <Link to="/dashboard" className="flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 shadow-sm transition-all">
            <Link to="/dashboard" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-2">
            Submit Verified Review
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Share your experience at {restaurantName}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}>
          <Alert className="mb-8 border border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-slate-800/80 text-blue-800 dark:text-blue-300 shadow-md backdrop-blur-sm">
            <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-300 font-medium">
              How Verified Reviews Work
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              This review system uses zero-knowledge proofs to verify that you
              have visited the restaurant without revealing your identity or
              exact visit details. You need to upload the verification file you
              received during your visit or generate a test one for demo
              purposes.
            </AlertDescription>
          </Alert>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}>
          <ZkReviewForm
            restaurantId={restaurantId}
            onSuccess={() => {
              // In a real app, we might navigate away or show a success message
              // For now, we'll just leave it in the component
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default VerifiedReviewPage;
