import { useState, useEffect } from 'react';
import {
  Star,
  BarChart3,
  Filter,
  Search,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import ReviewsLayout from './ReviewsLayout';
import ReviewCard from './ReviewCard';
import { createClient } from '@supabase/supabase-js';

// Define types
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  avg_rating: number;
  user_id: string;
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
  restaurant: Restaurant;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, positive, negative
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest

  // Create Supabase client (replace with your URL and anon key)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error('You must be logged in to view reviews');
        }

        // Get restaurants owned by the current user
        const { data: restaurants, error: restaurantError } = await supabase
          .from('restaurants')
          .select('id')
          .eq('user_id', user.id);

        if (restaurantError) throw restaurantError;

        if (!restaurants || restaurants.length === 0) {
          setReviews([]);
          setFilteredReviews([]);
          setLoading(false);
          return;
        }

        // Get restaurant IDs
        const restaurantIds = restaurants.map((r) => r.id);

        // Fetch reviews for those restaurants
        const { data, error } = await supabase
          .from('reviews')
          .select(
            `
            *,
            user:users(*),
            restaurant:restaurants(*)
          `
          )
          .in('restaurant_id', restaurantIds)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setReviews(data || []);
        setFilteredReviews(data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred fetching reviews'
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Update filtered reviews when search, filter, or sort changes
  useEffect(() => {
    let result = [...reviews];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (review) =>
          review.review_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.restaurant.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${review.user.first_name} ${review.user.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply rating filter
    if (filter === 'positive') {
      result = result.filter((review) => review.rating >= 4);
    } else if (filter === 'negative') {
      result = result.filter((review) => review.rating <= 2);
    } else if (filter === 'neutral') {
      result = result.filter((review) => review.rating === 3);
    }

    // Apply sorting
    if (sortBy === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === 'oldest') {
      result.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.rating - b.rating);
    }

    setFilteredReviews(result);
  }, [reviews, searchTerm, filter, sortBy]);

  // Calculate summary stats
  const totalReviews = reviews.length;
  const avgRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : '0.0';
  const positiveReviews = reviews.filter((r) => r.rating >= 4).length;
  const positivePercentage = totalReviews
    ? Math.round((positiveReviews / totalReviews) * 100)
    : 0;

  return (
    <ReviewsLayout>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-4 sm:mb-6 flex items-center">
          <Star className="mr-2 h-6 w-6 text-yellow-500" />
          Customer Reviews
        </h2>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6 border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-100 mb-1">Total Reviews</p>
                <h3 className="text-2xl sm:text-3xl font-bold">
                  {totalReviews}
                </h3>
              </div>
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 border-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-violet-100 mb-1">Average Rating</p>
                <h3 className="text-2xl sm:text-3xl font-bold">{avgRating}</h3>
                <div className="flex mt-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.round(Number(avgRating))
                            ? 'text-yellow-300 fill-yellow-300'
                            : 'text-white/30'
                        }`}
                      />
                    ))}
                </div>
              </div>
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                <Star className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 border-0 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 mb-1">Positive Reviews</p>
                <h3 className="text-2xl sm:text-3xl font-bold">
                  {positivePercentage}%
                </h3>
                <p className="text-blue-100 text-xs sm:text-sm mt-1">
                  {positiveReviews} out of {totalReviews} reviews
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search reviews..."
              className="pl-9 border-indigo-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white border-indigo-100">
                  <Filter className="h-4 w-4 mr-2 text-indigo-600" />
                  {filter === 'all' && 'All Reviews'}
                  {filter === 'positive' && 'Positive Reviews'}
                  {filter === 'negative' && 'Negative Reviews'}
                  {filter === 'neutral' && 'Neutral Reviews'}
                  <ChevronDown className="h-4 w-4 ml-2 text-indigo-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 shadow-md border border-indigo-100">
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  All Reviews
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('positive')}>
                  Positive Reviews (4-5★)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('neutral')}>
                  Neutral Reviews (3★)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('negative')}>
                  Negative Reviews (1-2★)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white border-indigo-100">
                  <span className="hidden sm:inline">Sort by:</span>
                  {sortBy === 'newest' && 'Newest'}
                  {sortBy === 'oldest' && 'Oldest'}
                  {sortBy === 'highest' && 'Highest Rated'}
                  {sortBy === 'lowest' && 'Lowest Rated'}
                  <ChevronDown className="h-4 w-4 ml-2 text-indigo-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36 shadow-md border border-indigo-100">
                <DropdownMenuItem onClick={() => setSortBy('newest')}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                  Oldest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('highest')}>
                  Highest Rated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('lowest')}>
                  Lowest Rated
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 sm:space-y-6">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : error ? (
            <Card className="p-6 text-center text-red-500 border border-red-200 bg-red-50">
              <p>{error}</p>
            </Card>
          ) : filteredReviews.length === 0 ? (
            <Card className="p-6 text-center text-gray-500 border border-indigo-100">
              <p>No reviews found. Adjust your filters or search term.</p>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </div>
      </div>
    </ReviewsLayout>
  );
};

export default Reviews;
