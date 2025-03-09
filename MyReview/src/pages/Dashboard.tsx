"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Bell,
  Settings,
  User,
  LogOut,
  Zap,
  BarChart3,
  Users,
  RefreshCw,
  Star,
  Maximize2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { useToast } from "../components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

const Dashboard = () => {
  const [key, setKey] = useState("initial-key"); // Start with a stable key
  const [currentLink] = useState("https://riadfarouzi.com");
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
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
      title: "Link copied!",
      description: "The review link has been copied to your clipboard.",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-indigo-100 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent flex items-center"
            >
              <Zap className="mr-2 h-5 w-5 text-indigo-500" />
              TrustReview
            </motion.h2>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2">
            <div className=" flex items-center space-x-1 sm:space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="bg-blue-100hover:bg-indigo-50 transition-colors relative group hidden sm:flex"
              >
                <Bell className="h-5 w-5 text-indigo-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-indigo-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Notifications
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-indigo-50 transition-colors"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-indigo-500 transition-all hover:ring-violet-500 shadow-md">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        U
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 shadow-lg border border-indigo-100"
                >
                  <DropdownMenuLabel className="font-semibold text-indigo-800">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-indigo-100" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 transition-colors">
                    <User className="mr-2 h-4 w-4 text-indigo-600" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 transition-colors">
                    <Settings className="mr-2 h-4 w-4 text-indigo-600" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-indigo-100" />
                  <DropdownMenuItem className="cursor-pointer text-red-500 hover:bg-red-50 transition-colors">
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
      <main className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 max-w-7xl py-6 sm:py-8 md:py-12">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-4 sm:mb-6 flex items-center">
            <BarChart3 className="mr-2 h-6 w-6 text-indigo-600" />
            Analytics Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            <Card className="p-4 sm:p-6 border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-indigo-100 mb-1">Total Reviews</p>
                  <h3 className="text-2xl sm:text-3xl font-bold">128</h3>
                  <p className="text-indigo-100 text-xs sm:text-sm mt-2">
                    +12% from last month
                  </p>
                </div>
                <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                  <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 border-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-violet-100 mb-1">Average Rating</p>
                  <h3 className="text-2xl sm:text-3xl font-bold">4.8</h3>
                  <p className="text-violet-100 text-xs sm:text-sm mt-2">
                    +0.3 from last month
                  </p>
                </div>
                <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 border-0 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 mb-1">QR Scans</p>
                  <h3 className="text-2xl sm:text-3xl font-bold">243</h3>
                  <p className="text-blue-100 text-xs sm:text-sm mt-2">
                    +18% from last month
                  </p>
                </div>
                <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* QR Code and Review Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-1 lg:grid-cols-2"
        >
          {/* QR Code Section */}
          <Card className="p-4 sm:p-6 border border-indigo-100 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-indigo-800 flex items-center flex-wrap">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="mr-2 bg-indigo-100 p-1.5 rounded-full"
              >
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
              </motion.div>
              Your Review QR Code
            </h3>
            <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 w-full">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 20px 25px -5px rgba(79, 70, 229, 0.1), 0 10px 10px -5px rgba(79, 70, 229, 0.04)",
                }}
                className="flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 border-2 border-indigo-200 rounded-xl p-3 bg-white shadow-md transition-all duration-300 relative overflow-hidden mx-auto cursor-pointer"
                onClick={() => setIsQRDialogOpen(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-violet-50 opacity-50"></div>
                <QRCodeSVG
                  key={key}
                  value={`${currentLink}?k=${key}`}
                  size={200}
                  level="H"
                  includeMargin={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    display: "block",
                  }}
                />
              </motion.div>

              <Button
                onClick={() => setIsQRDialogOpen(true)}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 px-4 py-2 mx-auto mb-3"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                <span>View Full Screen</span>
              </Button>

              <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2.5 rounded-full text-indigo-700 text-sm font-medium text-center w-full sm:w-auto max-w-xs mx-auto">
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <p>QR Code refreshes every 10 seconds</p>
              </div>
            </div>
          </Card>

          {/* Link Section */}
          <Card className="p-4 sm:p-6 border border-indigo-100 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-indigo-800 flex items-center flex-wrap">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mr-2 bg-indigo-100 p-1.5 rounded-full"
              >
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
                  value={currentLink}
                  className="flex-1 px-3 sm:px-4 py-3 border border-indigo-200 rounded-lg bg-indigo-50 text-black font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-full"
                />
                <Button
                  onClick={handleCopyLink}
                  className="px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                >
                  Copy
                </Button>
              </div>
              <Button
                onClick={handleCopyLink}
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
              >
                Create new link
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>

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
                value={`${currentLink}?k=${key}`}
                size={400}
                level="H"
                includeMargin={true}
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "100%",
                  display: "block",
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
    </div>
  );
};

export default Dashboard;
