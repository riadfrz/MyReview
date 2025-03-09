import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar Navigation */}
      <Navigation />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-indigo-100 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm md:pl-64">
        <div className="container mx-auto px-4 sm:px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex md:hidden">
            {/* Mobile hamburger button is now fixed position, so this is just a spacer */}
            <div className="w-8"></div>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2">
            <div className="flex items-center space-x-1 sm:space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="bg-blue-100 hover:bg-indigo-50 transition-colors relative group hidden sm:flex">
                <Bell className="h-5 w-5 text-indigo-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Notifications
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-indigo-50 transition-colors">
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
                  className="w-56 shadow-lg border border-indigo-100 bg-white">
                  <DropdownMenuLabel className="font-semibold text-indigo-800">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-indigo-100" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 transition-colors text-gray-700">
                    <User className="mr-2 h-4 w-4 text-indigo-600" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 transition-colors text-gray-700">
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

      {/* Main Content Area - pushed to right of sidebar on desktop */}
      <div className="md:pl-64">
        <main className="min-h-screen px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
