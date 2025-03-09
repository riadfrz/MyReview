import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../layout/Navigation';

interface ReviewsLayoutProps {
  children: ReactNode;
}

const ReviewsLayout = ({ children }: ReviewsLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navigation />
      <div className="md:pl-64">
        <main className="min-h-screen px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ReviewsLayout;
