import { Star, Calendar, ThumbsUp, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card } from '../ui/card';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Review {
  id: string;
  restaurant_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  updated_at: string;
  user: User;
  restaurant: {
    id: string;
    name: string;
    address: string;
  };
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  // Handle cases where user names might be empty
  const firstName = review.user.first_name || 'Anonymous';
  const lastName = review.user.last_name || 'User';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  const fullName = `${firstName} ${lastName}`;

  // Format dates
  const formattedDate = format(new Date(review.created_at), 'MMM d, yyyy');
  const timeAgo = formatDistanceToNow(new Date(review.created_at), {
    addSuffix: true,
  });

  // Function to render star rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
          }`}
        />
      ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}>
      <Card className="p-4 sm:p-6 border border-indigo-100 bg-white shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col space-y-4">
          {/* Review Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-indigo-500">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${initials}`}
                  alt={fullName}
                />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-800">{fullName}</h3>
                <div className="flex items-center mt-1">
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span title={formattedDate}>{timeAgo}</span>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="bg-indigo-50 rounded-md px-3 py-2">
            <p className="text-sm font-medium text-indigo-800">
              {review.restaurant.name}
            </p>
            <p className="text-xs text-gray-600">{review.restaurant.address}</p>
          </div>

          {/* Review Content */}
          <div className="mt-2">
            <p className="text-gray-700">{review.review_text}</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-indigo-600">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="text-xs">Helpful</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-indigo-600">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-xs">Reply</span>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ReviewCard;
