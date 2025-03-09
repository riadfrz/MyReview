import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BarChart3, Home, Users, Settings, Star, Zap } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';

// Helper function to conditionally join classNames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

interface Route {
  label: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

const routes: Route[] = [
  {
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    color: 'text-indigo-600',
  },
  {
    label: 'Reviews',
    icon: Star,
    href: '/reviews',
    color: 'text-yellow-600',
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    color: 'text-blue-600',
  },
  {
    label: 'Customers',
    icon: Users,
    href: '/customers',
    color: 'text-violet-600',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    color: 'text-gray-600',
  },
];

const Navigation = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 bg-white hover:bg-indigo-50 shadow-sm">
              <svg
                width="24"
                height="24"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-600">
                <path
                  d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1.5 7C1.22386 7 1 7.22386 1 7.5C1 7.77614 1.22386 8 1.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H1.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"></path>
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="h-full flex flex-col">
              <div className="px-6 py-4 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-indigo-500" />
                  <h2 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    TrustReview
                  </h2>
                </div>
              </div>
              <div className="flex flex-col gap-1 px-2 py-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors',
                      pathname === route.href
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'text-gray-700 hover:bg-indigo-50'
                    )}>
                    <route.icon className={cn('h-5 w-5', route.color)} />
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col border-r border-indigo-100 bg-white fixed left-0 top-0 z-20">
        <div className="px-6 py-4 border-b border-indigo-100">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              TrustReview
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-2 py-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors',
                pathname === route.href
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'text-gray-700 hover:bg-indigo-50'
              )}>
              <route.icon className={cn('h-5 w-5', route.color)} />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
