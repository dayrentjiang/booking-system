import Link from 'next/link'
import { LayoutDashboard, Calendar, Aperture as Court, BarChart2 } from 'lucide-react'

const menuItems = [
  { icon: <LayoutDashboard size={20} />, text: 'Dashboard', path: '/owner' },
  { icon: <Calendar size={20} />, text: 'Bookings', path: '/owner/bookings' },
  { icon: <Court size={20} />, text: 'Courts', path: '/owner/courts' },
  { icon: <BarChart2 size={20} />, text: 'Reports', path: '/owner/reports' },
]

export function Sidebar() {
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
            href={item.path}
            className="flex items-center gap-3 text-gray-300 hover:bg-gray-800 px-4 py-3 rounded-lg mb-1"
          >
            {item.icon}
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}