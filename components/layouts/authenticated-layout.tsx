import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation with Profile */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="flex h-16 items-center justify-between px-4 max-w-[100vw]">
          <h2 className="text-lg font-semibold">
            Hi, {user?.name?.split(' ')[0] || 'Guest'} 👋
          </h2>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 relative z-50">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600 font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white rounded-md shadow-lg border mt-2">
              <DropdownMenuLabel className="bg-white">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="bg-white hover:bg-gray-50">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="bg-white hover:bg-gray-50">
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem onClick={handleLogout} className="bg-white hover:bg-gray-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-16">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};