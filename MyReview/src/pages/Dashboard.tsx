'use client';

import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Bell, Settings, User, LogOut } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { useToast } from '../components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

const Dashboard = () => {
  const [key, setKey] = useState('initial-key'); // Start with a stable key
  const [currentLink] = useState('https://riadfarouzi.com');
  const { toast } = useToast();

  useEffect(() => {
    // Only start updating the key after initial render
    const interval = setInterval(() => {
      setKey(`${Date.now()}-${Math.random()}`);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentLink);
    toast({
      title: 'Link copied!',
      description: 'The review link has been copied to your clipboard.',
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"
            >
              Dashboard
            </motion.h2>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-blue-500 transition-all hover:ring-teal-500">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 md:grid-cols-2"
        >
          {/* QR Code Section */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
              Your Review QR Code
            </h3>
            <div className="flex flex-col items-center justify-center space-y-6 w-full">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-center w-48 h-48 border-2 rounded-xl p-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <QRCodeSVG
                  key={key}
                  value={`${currentLink}?k=${key}`}
                  size={176}
                  level="H"
                  includeMargin={false}
                />
              </motion.div>
              <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                QR Code refreshes every 10 seconds
              </p>
            </div>
          </Card>

          {/* Link Section */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
              Review Link
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share this link with your customers:
              </p>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  readOnly
                  value={currentLink}
                  className="flex-1 px-4 py-2.5 border rounded-lg bg-muted font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="secondary"
                  className="px-6 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  Copy
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;