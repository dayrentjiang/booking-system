import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Court, 
  BarChart2, 
  User,
  Menu
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, text: 'Dashboard', path: '/owner' },
    { icon: <Calendar size={20} />, text: 'Bookings', path: '/owner/bookings' },
    { icon: <Court size={20} />, text: 'Courts', path: '/owner/courts' },
    { icon: <BarChart2 size={20} />, text: 'Reports', path: '/owner/reports' },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Court size={32} />
        <span className="text-xl font-bold">CourtMaster</span>
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.text}
            to={item.path}
            className="flex items-center gap-3 text-gray-300 hover:bg-gray-800 px-4 py-3 rounded-lg mb-1"
          >
            {item.icon}
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

const TopBar = () => {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <button className="lg:hidden">
        <Menu size={24} />
      </button>
      <div></div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <User size={24} />
        </div>
      </div>
    </div>
  );
};

export default function OwnerDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}