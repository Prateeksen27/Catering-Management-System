import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Menu as MenuIcon, 
  FileText, 
  Store, 
  ChevronDown,
  ChevronRight,
  BookOpen,
  Eye,
  CheckCircle,
  Clock,
  X,
  Car
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '../../store/useAuthStore';
import { IconClipboardCopy, IconShoppingCart } from '@tabler/icons-react';
import { rolePermissions } from '@/config/rolePermissions';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isBookingsOpen, setIsBookingsOpen] = useState(true);
  
  // Safely get location with error handling
  let location;
  try {
    location = useLocation();
  } catch (error) {
    // Fallback if router context is not available yet
    location = { pathname: '/' };
  }

  const menuItems = [
    {
      key:"BOOKINGS",
      title: 'Bookings',
      icon: BookOpen,
      path: '/bookings',
      hasSubmenu: true,
      submenu: [
        {key:"BOOKINGS_INQUIRE", title: 'Inquire', icon: Eye, path: '/bookings/inquire' },
        { key:"BOOKINGS_BOOKED", title: 'Booked', icon: CheckCircle, path: '/bookings/booked' },
        { key:"BOOKINGS_PENDING", title: 'Pending', icon: Clock, path: '/bookings/pending' },
        { key:"BOOKINGS_COMPLETED", title: 'Completed', icon: CheckCircle, path: '/bookings/completed' },
      ]
    },
    {
      key:"CALENDAR",
      title: 'Calendar',
      icon: Calendar,
      path: '/calendar'
    },
    {
      key:"EMPLOYEES",
      title: 'Employees',
      icon: Users,
      path: '/employees'
    },
    {
      key:"MENU",
      title: 'Menu',
      icon: MenuIcon,
      path: '/menu'
    },
    {
      key:"ASSIGNED_WORK",
      title: 'Assigned Work',
      icon: FileText,
      path: '/assigned-word'
    },
    {
      key:"ASSIGNED_EVENTS",
      title:"Assigned Events",
      icon:IconClipboardCopy,
      path:'/assigned-events'
    },
    {
      key:"STORE",
      title: 'Store',
      icon: Store,
      path: '/store'
    },
    {
      key:"INVENTORY",
      title:'Inventory',
      icon:IconShoppingCart,
      path:'/inventory'
    },
    {
      key:"VEHICLES",
      title: 'Vehicles',
      icon: Car,
      path: '/vehicles'
    }
  ];
  const {user} = useAuthStore()
  const allowedMenus = rolePermissions[user.empType]?.menus || [];
  const filteredMenuItems = menuItems.map(item=>{
    if(item.hasSubmenu){
      const filteredSubmenu = item.submenu.filter(sub=>
        allowedMenus.includes(sub.key) || allowedMenus.includes("BOOKINGS_ALL")
      )
      if(filteredSubmenu.length === 0){
        return null;
      }
      return {...item,submenu:filteredSubmenu}
    }
    return allowedMenus.includes(item.key) ? item : null;
  }).filter(Boolean);
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 z-50 lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Link to='/' >
            <div className="w-10 h-10 bg-primary p-4 rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CMS</span>
            </div>
            </Link>
            <span className="font-semibold text-foreground">{user.empType}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Menu Label */}
        <div className="px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">MENU</span>
        </div>

        {/* Navigation */}
        <nav className="px-2 pb-4 space-y-1">
          {filteredMenuItems.map((item) => (
            <div key={item.title}>
              {item.hasSubmenu ? (
                <>
                  <button
                    onClick={() => setIsBookingsOpen(!isBookingsOpen)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-sidebar-active-bg hover:text-sidebar-active transition-all duration-200",
                      location.pathname.startsWith(item.path) && "bg-sidebar-active-bg text-sidebar-active"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {isBookingsOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  {isBookingsOpen && item.submenu && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          onClick={onClose}
                          className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200",
                            isActive 
                              ? "bg-sidebar-active-bg text-sidebar-active" 
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                          <span>{subItem.title}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-sidebar-active-bg text-sidebar-active" 
                      : "text-foreground hover:bg-sidebar-active-bg hover:text-sidebar-active"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;