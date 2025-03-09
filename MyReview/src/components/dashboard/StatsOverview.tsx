import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { BarChart3, Star, Users, RefreshCw } from 'lucide-react';

interface StatsOverviewProps {
  totalReviews: number;
  reviewsGrowth: number;
  avgRating: number;
  ratingGrowth: number;
  totalScans: number;
  scansGrowth: number;
}

const StatsOverview = ({
  totalReviews = 128,
  reviewsGrowth = 12,
  avgRating = 4.8,
  ratingGrowth = 0.3,
  totalScans = 243,
  scansGrowth = 18,
}: Partial<StatsOverviewProps>) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 sm:mb-10 md:mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-4 sm:mb-6 flex items-center">
        <BarChart3 className="mr-2 h-6 w-6 text-indigo-600" />
        Analytics Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {/* Total Reviews Card */}
        <Card className="p-4 sm:p-6 border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 mb-1">Total Reviews</p>
              <h3 className="text-2xl sm:text-3xl font-bold">{totalReviews}</h3>
              <p className="text-indigo-100 text-xs sm:text-sm mt-2">
                +{reviewsGrowth}% from last month
              </p>
            </div>
            <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
              <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
          </div>
        </Card>

        {/* Average Rating Card */}
        <Card className="p-4 sm:p-6 border-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-violet-100 mb-1">Average Rating</p>
              <h3 className="text-2xl sm:text-3xl font-bold">{avgRating}</h3>
              <p className="text-violet-100 text-xs sm:text-sm mt-2">
                +{ratingGrowth} from last month
              </p>
            </div>
            <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
              <Star className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
          </div>
        </Card>

        {/* QR Scans Card */}
        <Card className="p-4 sm:p-6 border-0 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 mb-1">QR Scans</p>
              <h3 className="text-2xl sm:text-3xl font-bold">{totalScans}</h3>
              <p className="text-blue-100 text-xs sm:text-sm mt-2">
                +{scansGrowth}% from last month
              </p>
            </div>
            <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
              <Users className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default StatsOverview;
