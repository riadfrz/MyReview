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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Submit Verified Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Your Name</Label>
            <Input
              id="clientName"
              placeholder="Enter your name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Select
              value={rating}
              onValueChange={setRating}
              disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    <div className="flex items-center">
                      {Array.from({ length: num }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                      {Array.from({ length: 5 - num }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gray-300" />
                      ))}
                      <span className="ml-2">
                        {num} star{num !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewText">Review</Label>
            <Textarea
              id="reviewText"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={isLoading}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signedMessage">Visit Verification</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="signedMessage"
                type="file"
                onChange={handleFileUpload}
                disabled={isLoading || !!signedMessage}
                accept="application/json,text/plain"
              />

              {signedMessage ? (
                <div className="p-2 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
                  Visit verification uploaded ✓
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateTestSignedMessage}
                  disabled={isLoading}>
                  Generate Test Verification (For Demo)
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading || !clientName || !reviewText || !signedMessage}>
          {isLoading ? 'Submitting...' : 'Submit Verified Review'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ZkReviewForm;
