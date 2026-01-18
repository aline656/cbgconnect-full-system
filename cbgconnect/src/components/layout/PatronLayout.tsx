// src/components/layout/PatronLayout.tsx
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  Home,
  BarChart3,
  FileText,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { NotificationBell } from '@/components/notifications/NotificationBell';

const navItems = [
  { href: '/patron', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/patron/boys', icon: Users, label: 'Boys Management' },
  { href: '/patron/dormitory', icon: Home, label: 'Dormitory Assignment' },
  { href: '/patron/analysis', icon: BarChart3, label: 'Analysis' },
  { href: '/patron/reports', icon: FileText, label: 'Reports' },
  { href: '/patron/profile', icon: User, label: 'Profile' },
  { href: '/notifications', icon: FileText, label: 'Notifications' }, // Add notification page link
];

export default function PatronLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-emerald-50/50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/80 backdrop-blur-sm"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 transform bg-white/80 backdrop-blur-sm border-r
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500" />
            <span className="text-xl font-bold">SchoolPatron</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href === '/patron' && location.pathname === '/patron/dashboard');
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100/50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.href === '/notifications' && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <div className="mb-4">
            <Link to="/notifications" onClick={() => setSidebarOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Notifications
                <span className="ml-auto h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="min-h-screen">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b">
            <div className="flex h-16 items-center justify-between px-4 lg:px-8">
              <div>
                <h1 className="text-xl font-semibold">
                  {navItems.find(item => 
                    location.pathname === item.href || 
                    (item.href === '/patron' && location.pathname === '/patron/dashboard')
                  )?.label || 'Patron Portal'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {location.pathname === '/patron' || location.pathname === '/patron/dashboard' 
                    ? 'Overview of boys dormitory management' 
                    : `Manage ${navItems.find(item => 
                        location.pathname === item.href || 
                        (item.href === '/patron' && location.pathname === '/patron/dashboard')
                      )?.label?.toLowerCase()}`}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <NotificationBell />
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">Mr. John Smith</p>
                    <p className="text-xs text-muted-foreground">Senior Patron</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                    JS
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-8">
            <div className="rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60">
              <div className="p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}