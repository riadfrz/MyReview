"use client";

import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";

const Header = () => (
  <header className="fixed top-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 z-50">
    <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-8">
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"
        >
          TrustReview
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/about"
            className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
          >
            About
          </Link>
          <Link
            to="/features"
            className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
          >
            Pricing
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/signin">
          <Button
            variant="ghost"
            className="font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            Sign In
          </Button>
        </Link>
        <Link to="/signup">
          <Button className="font-medium bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 border-0 text-white shadow-md hover:shadow-lg transition-all duration-200">
            Sign Up
          </Button>
        </Link>
      </div>
    </nav>
  </header>
);

export default Header;
