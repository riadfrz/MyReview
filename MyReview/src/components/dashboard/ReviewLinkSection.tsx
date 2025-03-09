import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface ReviewLinkSectionProps {
  link: string;
  onCreateNewLink?: () => void;
}

const ReviewLinkSection = ({
  link = 'https://riadfarouzi.com',
  onCreateNewLink,
}: Partial<ReviewLinkSectionProps>) => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link copied!',
      description: 'The review link has been copied to your clipboard.',
      duration: 2000,
    });
  };

  const handleCreateNewLink = () => {
    if (onCreateNewLink) {
      onCreateNewLink();
    } else {
      // Default behavior if no handler provided
      toast({
        title: 'Creating new link',
        description: 'This feature will be available soon.',
        duration: 2000,
      });
    }
  };

  return (
    <Card className="p-4 sm:p-6 border border-indigo-100 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-indigo-800 flex items-center flex-wrap">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mr-2 bg-indigo-100 p-1.5 rounded-full">
          <Star className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
        </motion.div>
        Review Link
      </h3>
      <div className="space-y-3 sm:space-y-4">
        <p className="text-indigo-600 font-medium text-sm sm:text-base">
          Share this link with your customers:
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full">
          <input
            type="text"
            readOnly
            value={link}
            className="flex-1 px-3 sm:px-4 py-3 border border-indigo-200 rounded-lg bg-indigo-50 text-black font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-full"
          />
          <Button
            onClick={handleCopyLink}
            className="px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto">
            Copy
          </Button>
        </div>
        <Button
          onClick={handleCreateNewLink}
          className="px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto">
          Create new link
        </Button>
      </div>
    </Card>
  );
};

export default ReviewLinkSection;
