import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ZkReviewForm from '../components/review/ZkReviewForm';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      <div className="container mx-auto py-8 px-4">
        <p>Loading restaurant details...</p>
      </div>
    );
  }

  if (error || !restaurantId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'No restaurant ID provided'}
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        Submit Verified Review for {restaurantName}
      </h1>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>How Verified Reviews Work</AlertTitle>
        <AlertDescription>
          This review system uses zero-knowledge proofs to verify that you have
          visited the restaurant without revealing your identity or exact visit
          details. You need to upload the verification file you received during
          your visit or generate a test one for demo purposes.
        </AlertDescription>
      </Alert>

      <ZkReviewForm
        restaurantId={restaurantId}
        onSuccess={() => {
          // In a real app, we might navigate away or show a success message
          // For now, we'll just leave it in the component
        }}
      />
    </div>
  );
};

export default VerifiedReviewPage;
