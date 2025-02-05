'use client';

import React from 'react';
import { useState } from 'react';

// Time slots from 8 AM to 8 PM in hourly intervals
const timeSlots = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 8;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Updated dummy bookings data with duration
const dummyBookings = [
  { court: 'Court 1', day: 'Monday', startTime: '10:00', duration: 2, customer: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  { court: 'Court 2', day: 'Monday', startTime: '14:00', duration: 2, customer: 'Jane Smith', email: 'jane@example.com', phone: '123-456-7891' },
  { court: 'Court 1', day: 'Tuesday', startTime: '09:00', duration: 2, customer: 'Mike Johnson', email: 'mike@example.com', phone: '123-456-7892' },
  { court: 'Court 3', day: 'Wednesday', startTime: '16:00', duration: 2, customer: 'Sarah Wilson', email: 'sarah@example.com', phone: '123-456-7893' },
  { court: 'Court 2', day: 'Thursday', startTime: '11:00', duration: 2, customer: 'Tom Brown', email: 'tom@example.com', phone: '123-456-7894' },
  { court: 'Court 1', day: 'Friday', startTime: '15:00', duration: 2, customer: 'Emily Davis', email: 'emily@example.com', phone: '123-456-7895' },
];

const CourtTimetable = ({ courtName, onBookingClick }: { courtName: string; onBookingClick: (booking: any) => void }) => {
  // Helper function to check if a slot is part of a booking
  const getBookingForSlot = (day: string, time: string) => {
    return dummyBookings.find(booking => {
      if (booking.court !== courtName || booking.day !== day) return false;
      
      const [bookingHour] = booking.startTime.split(':').map(Number);
      const [slotHour] = time.split(':').map(Number);
      
      const bookingStartHour = bookingHour;
      const bookingEndHour = bookingHour + booking.duration;
      
      return slotHour >= bookingStartHour && slotHour < bookingEndHour;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{courtName}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="sticky left-0 z-10 bg-gray-50 w-20 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-r border-gray-200">
                Time
              </th>
              {days.map((day, index) => (
                <th 
                  key={day} 
                  className={`w-[14.28%] px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-b ${
                    index < days.length - 1 ? 'border-r border-gray-200' : ''
                  }`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {timeSlots.map((time, timeIndex) => (
              <tr key={`${courtName}-${time}-${timeIndex}`} className="hover:bg-gray-50">
                <td className="sticky left-0 z-10 bg-white w-20 px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap border-r border-gray-200">
                  {time}
                </td>
                {days.map((day, dayIndex) => {
                  const booking = getBookingForSlot(day, time);
                  const isFirstSlotOfBooking = booking?.startTime === time;
                  
                  return (
                    <td 
                      key={`${courtName}-${day}-${time}-${dayIndex}`}
                      className={`w-[14.28%] px-3 py-3 relative group transition-colors duration-150 
                        ${booking ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-100 cursor-pointer'}
                        ${dayIndex < days.length - 1 ? 'border-r border-gray-200' : ''}
                      `}
                      onClick={() => booking && onBookingClick(booking)}
                    >
                      {isFirstSlotOfBooking && (
                        <div className={`
                          absolute inset-0 m-1 rounded-md
                          ${booking ? 'bg-blue-100 group-hover:bg-blue-200 shadow-sm' : ''}
                          transition-all duration-150 ease-in-out
                          flex flex-col items-center justify-center
                        `}>
                          <div className="font-medium text-blue-800 truncate text-sm px-1">
                            {booking.customer}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            {booking.duration}h
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function BookingsPage() {
  const courts = ['Court 1', 'Court 2', 'Court 3'];
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage your court bookings</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 shadow-sm">
          New Booking
        </button>
      </div>

      <div className="space-y-6">
        {courts.map(court => (
          <CourtTimetable 
            key={court} 
            courtName={court} 
            onBookingClick={setSelectedBooking}
          />
        ))}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 max-w-lg mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer</label>
                  <p className="mt-1 text-gray-900">{selectedBooking.customer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-gray-900">{selectedBooking.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-gray-900">{selectedBooking.phone}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Court</label>
                    <p className="mt-1 text-gray-900">{selectedBooking.court}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Day</label>
                    <p className="mt-1 text-gray-900">{selectedBooking.day}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Time</label>
                    <p className="mt-1 text-gray-900">{selectedBooking.startTime}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Duration</label>
                    <p className="mt-1 text-gray-900">{selectedBooking.duration} hours</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}