import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import QRCodeSection from '../components/dashboard/QRCodeSection';
import ReviewLinkSection from '../components/dashboard/ReviewLinkSection';

const Dashboard = () => {
  const [currentLink, setCurrentLink] = useState('https://riadfarouzi.com');

  // Sample data - in a real app, this would come from an API
  const dashboardData = {
    totalReviews: 128,
    reviewsGrowth: 12,
    avgRating: 4.8,
    ratingGrowth: 0.3,
    totalScans: 243,
    scansGrowth: 18,
  };

  const handleCreateNewLink = () => {
    // This would typically call an API to generate a new link
    setCurrentLink(`https://riadfarouzi.com/review/${Date.now()}`);
  };

  return (
    <AppLayout>
      {/* Stats Overview Section */}
      <StatsOverview
        totalReviews={dashboardData.totalReviews}
        reviewsGrowth={dashboardData.reviewsGrowth}
        avgRating={dashboardData.avgRating}
        ratingGrowth={dashboardData.ratingGrowth}
        totalScans={dashboardData.totalScans}
        scansGrowth={dashboardData.scansGrowth}
      />

      {/* QR Code and Review Link Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-1 lg:grid-cols-2">
        {/* QR Code Section */}
        <QRCodeSection link={currentLink} />

        {/* Review Link Section */}
        <ReviewLinkSection
          link={currentLink}
          onCreateNewLink={handleCreateNewLink}
        />
      </motion.div>
    </AppLayout>
  );
};

export default Dashboard;
