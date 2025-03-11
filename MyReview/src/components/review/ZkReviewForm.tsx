import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Star } from 'lucide-react';
import { Label } from '../ui/label';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://localhost:3002';

interface ZkReviewFormProps {
  restaurantId: string;
  onSuccess?: () => void;
}

const ZkReviewForm = ({ restaurantId, onSuccess }: ZkReviewFormProps) => {
  const [clientName, setClientName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('5');
  const [signedMessage, setSignedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle uploading a signed message file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      setSignedMessage(fileContent);
      toast.success('Visit verification uploaded successfully');
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Failed to read the visit verification file');
    }
  };

  // Function to generate a test signed message (for demo purposes)
  const generateTestSignedMessage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/generate-signed-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId }),
      });

      const data = await response.json();
      if (data.success) {
        setSignedMessage(data.signedMessage);
        toast.success('Test visit verification generated');
      } else {
        toast.error(data.error || 'Failed to generate test message');
      }
    } catch (error) {
      console.error('Error generating test message:', error);
      toast.error('Failed to generate test message');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to submit the review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName || !reviewText || !signedMessage) {
      toast.error(
        'Please fill in all fields and upload your visit verification'
      );
      return;
    }

    try {
      setIsLoading(true);

      // Format the review text to include the rating
      const formattedReviewText = `Rating: ${rating}/5 - ${reviewText}`;

      const response = await fetch(`${API_BASE_URL}/submit-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId,
          clientName,
          reviewText: formattedReviewText,
          signedMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Review submitted successfully!');
        // Reset form
        setClientName('');
        setReviewText('');
        setRating('5');
        setSignedMessage('');
        // Call onSuccess callback if provided
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-slate-200 dark:border-slate-700 overflow-hidden">
      <CardHeader className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 pb-6">
        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Your Review
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white dark:bg-slate-800 pt-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2">
            <Label
              htmlFor="clientName"
              className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Your Name
            </Label>
            <Input
              id="clientName"
              placeholder="Enter your name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              disabled={isLoading}
              required
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-shadow duration-200 focus:shadow-md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2">
            <Label
              htmlFor="rating"
              className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Rating
            </Label>
            <Select
              value={rating}
              onValueChange={setRating}
              disabled={isLoading}>
              <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-shadow duration-200 focus:shadow-md">
                <SelectValue placeholder="Select rating">
                  <div className="flex items-center">
                    {Array.from({ length: parseInt(rating) }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-0.5"
                      />
                    ))}
                    {Array.from({ length: 5 - parseInt(rating) }).map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-gray-300 mr-0.5"
                        />
                      )
                    )}
                    <span className="ml-2 text-slate-700 dark:text-slate-300">
                      {rating} star{parseInt(rating) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem
                    key={num}
                    value={num.toString()}
                    className="py-2 focus:bg-slate-100 dark:focus:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div className="flex items-center">
                      {Array.from({ length: num }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-0.5"
                        />
                      ))}
                      {Array.from({ length: 5 - num }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-gray-300 mr-0.5"
                        />
                      ))}
                      <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">
                        {num} star{num !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2">
            <Label
              htmlFor="reviewText"
              className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Your Review
            </Label>
            <Textarea
              id="reviewText"
              placeholder="Share your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={isLoading}
              required
              rows={4}
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-shadow duration-200 focus:shadow-md resize-none"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2">
            <Label
              htmlFor="signedMessage"
              className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Visit Verification
            </Label>
            <div className="flex flex-col gap-3">
              <Input
                id="signedMessage"
                type="file"
                onChange={handleFileUpload}
                disabled={isLoading || !!signedMessage}
                accept="application/json,text/plain"
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 file:bg-slate-100 dark:file:bg-slate-700 file:text-slate-700 dark:file:text-slate-300 file:border-0 file:rounded file:px-4 file:py-2 file:mr-4 file:hover:bg-slate-200 dark:file:hover:bg-slate-600 transition-all"
              />

              {signedMessage ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-300 text-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-green-500 dark:text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Visit verification uploaded successfully
                </motion.div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateTestSignedMessage}
                  disabled={isLoading}
                  className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition-all">
                  Generate Test Verification (For Demo)
                </Button>
              )}
            </div>
          </motion.div>
        </form>
      </CardContent>
      <CardFooter className="bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 py-4">
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium shadow-md transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          onClick={handleSubmit}
          disabled={isLoading || !clientName || !reviewText || !signedMessage}>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            'Submit Verified Review'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ZkReviewForm;
