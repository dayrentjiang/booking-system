import { Calendar, DollarSign, Users } from 'lucide-react'

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  description: string
}

const StatCard = ({ icon, title, value, description }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-blue-100 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </div>
)

interface UpcomingBookingProps {
  time: string
  court: string
  customer: string
}

const UpcomingBooking = ({ time, court, customer }: UpcomingBookingProps) => (
  <div className="flex items-center gap-4 p-4 hover:bg-gray-50">
    <div className="flex-1">
      <p className="font-medium">{time}</p>
      <p className="text-sm text-gray-600">{court}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600">{customer}</p>
    </div>
  </div>
)

export function DashboardOverview() {
  // This would normally come from an API or database
  const upcomingBookings = [
    { time: '09:00 AM', court: 'Court 1', customer: 'John Doe' },
    { time: '10:30 AM', court: 'Court 2', customer: 'Jane Smith' },
    { time: '02:00 PM', court: 'Court 1', customer: 'Mike Johnson' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Calendar className="text-blue-600" size={24} />}
          title="Today's Bookings"
          value="24"
          description="8 bookings remaining"
        />
        <StatCard
          icon={<DollarSign className="text-green-600" size={24} />}
          title="Monthly Revenue"
          value="$4,520"
          description="12% increase from last month"
        />
        <StatCard
          icon={<Users className="text-purple-600" size={24} />}
          title="Court Occupancy"
          value="85%"
          description="Average across all courts"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
        </div>
        <div className="divide-y">
          {upcomingBookings.map((booking, index) => (
            <UpcomingBooking key={index} {...booking} />
          ))}
        </div>
      </div>
    </div>
  )
}