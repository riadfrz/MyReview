import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { Zap, Maximize2, RefreshCw } from 'lucide-react';

interface QRCodeSectionProps {
  link: string;
}

const QRCodeSection = ({
  link = 'https://riadfarouzi.com',
}: Partial<QRCodeSectionProps>) => {
  const [key, setKey] = useState('initial-key');
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  useEffect(() => {
    // Update QR code every 10 seconds
    const interval = setInterval(() => {
      setKey(`${Date.now()}-${Math.random()}`);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4 sm:p-6 border border-indigo-100 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-indigo-800 flex items-center flex-wrap">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="mr-2 bg-indigo-100 p-1.5 rounded-full">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
        </motion.div>
        Your Review QR Code
      </h3>
      <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 w-full">
        <motion.div
          whileHover={{
            scale: 1.05,
            boxShadow:
              '0 20px 25px -5px rgba(79, 70, 229, 0.1), 0 10px 10px -5px rgba(79, 70, 229, 0.04)',
          }}
          className="flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 border-2 border-indigo-200 rounded-xl p-3 bg-white shadow-md transition-all duration-300 relative overflow-hidden mx-auto cursor-pointer"
          onClick={() => setIsQRDialogOpen(true)}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-violet-50 opacity-50"></div>
          <QRCodeSVG
            key={key}
            value={`${link}?k=${key}`}
            size={200}
            level="H"
            includeMargin={false}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              display: 'block',
            }}
          />
        </motion.div>

        <Button
          onClick={() => setIsQRDialogOpen(true)}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 px-4 py-2 mx-auto mb-3">
          <Maximize2 className="h-4 w-4 mr-2" />
          <span>View Full Screen</span>
        </Button>

        <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2.5 rounded-full text-indigo-700 text-sm font-medium text-center w-full sm:w-auto max-w-xs mx-auto">
          <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
          <p>QR Code refreshes every 10 seconds</p>
        </div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-blue-50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-indigo-800 flex items-center">
              <Zap className="mr-2 h-5 w-5 text-indigo-600" />
              Your Review QR Code
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl border-2 border-indigo-200 shadow-xl">
              <QRCodeSVG
                key={`dialog-${key}`}
                value={`${link}?k=${key}`}
                size={400}
                level="H"
                includeMargin={true}
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%',
                  display: 'block',
                }}
              />
            </div>
            <div className="mt-4 text-center text-indigo-700 text-sm font-medium">
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <p>QR Code refreshes every 10 seconds</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default QRCodeSection;
