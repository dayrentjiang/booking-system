import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Aperture as Court,
  BarChart2
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const userId = user?.id;

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      text: "Dashboard",
      path: `/owner/${userId}`
    },
    {
      icon: <Calendar size={20} />,
      text: "Bookings",
      path: `/owner/${userId}/bookings`
    },
    {
      icon: <Court size={20} />,
      text: "Courts",
      path: `/owner/${userId}/courts`
    },
    {
      icon: <BarChart2 size={20} />,
      text: "Reports",
      path: `/owner/${userId}/reports`
    }
  ];

  if (!userId) return null;

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Court size={32} />
        <span className="text-xl font-bold">BookLap</span>
      </div>
      <nav>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.text}
              href={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }
              `}
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
