"use client";
import React, { useState, useEffect } from "react";
import {
  format,
  parseISO,
  addWeeks,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  isSameDay
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
} from "lucide-react";
import { getAllBookingAction } from "@/actions/bookingAction/getAllBookingAction";

const BookingManagementPage = (props: { venueId: string; courtId: string }) => {
  const { venueId, courtId } = props;
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Sample data with multiple courts and bookings
  const bookings = [
    {
      id: "1",
      customer_id: "cust1",
      court_id: "court1",
      start_time: "2025-02-12 09:00:00",
      end_time: "2025-02-12 11:00:00", // 2-hour booking
      booking_status: "confirmed",
      payment_status: "confirmed",
      total_amount: 50
    },
    {
      id: "2",
      customer_id: "cust2",
      court_id: "court1",
      start_time: "2025-02-12 14:00:00",
      end_time: "2025-02-12 17:00:00", // 3-hour booking
      booking_status: "confirmed",
      payment_status: "confirmed",
      total_amount: 75
    }
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  useEffect(() => {
    //we will implement this later, fetch the bookings
    const getBookings = async () => {
      console.log("Fetching bookings for court:", courtId);
      const { data, error } = await getAllBookingAction(courtId);
      if (error) console.error("Error fetching bookings:", error);
      if (data) console.log("Fetched bookings:", data);
    };

    try {
      getBookings();
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, []);

  const handleNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const handlePrevWeek = () => setCurrentWeek(addWeeks(currentWeek, -1));
  const handleCurrentWeek = () => setCurrentWeek(new Date());

  // Group bookings by court
  const groupedBookings = bookings.reduce((acc, booking) => {
    if (!acc[booking.court_id]) {
      acc[booking.court_id] = [];
    }
    acc[booking.court_id].push(booking);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filterBookingsByDay = (bookings, selectedDay) => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

    return bookings.filter((booking) => {
      const bookingDate = parseISO(booking.start_time);
      const bookingDay = format(bookingDate, "EEEE");

      // Check if booking is within the current week and matches selected day
      return (
        isWithinInterval(bookingDate, { start: weekStart, end: weekEnd }) &&
        bookingDay === selectedDay
      );
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Booking Management</h1>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCurrentWeek}
              className="flex items-center gap-2"
            >
              <CalendarIcon className="w-4 h-4" />
              Current Week
            </Button>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={handlePrevWeek}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextWeek}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Week indicator */}
        <div className="text-sm text-gray-500 mb-4">
          Week of{" "}
          {format(
            startOfWeek(currentWeek, { weekStartsOn: 1 }),
            "MMMM d, yyyy"
          )}
        </div>

        {/* Day selection tabs */}
        <div className="flex space-x-1 mb-6 overflow-x-auto">
          {weekDays.map((day) => {
            const dayDate = weekDays.indexOf(day);
            const currentDate = addWeeks(
              startOfWeek(currentWeek, { weekStartsOn: 1 }),
              0
            );
            currentDate.setDate(currentDate.getDate() + dayDate);

            const isToday = isSameDay(currentDate, new Date());

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedDay === day
                    ? "bg-blue-500 text-white"
                    : isToday
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div>{day}</div>
                <div className="text-xs">{format(currentDate, "MMM d")}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedBookings).map(([courtId, courtBookings]) => {
          const filteredBookings = filterBookingsByDay(
            courtBookings,
            selectedDay
          );

          if (filteredBookings.length === 0) {
            return null; // Don't show empty courts
          }

          return (
            <Card key={courtId} className="w-full">
              <CardHeader>
                <CardTitle>Court {courtId}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border rounded-lg p-4 space-y-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Booking #{booking.id}</h3>
                          <p className="text-sm text-gray-500">
                            Customer ID: {booking.customer_id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${booking.total_amount}</p>
                          <p className="text-sm text-gray-500">
                            {format(parseISO(booking.start_time), "PPp")}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Badge
                          variant="secondary"
                          className={getStatusColor(booking.booking_status)}
                        >
                          {booking.booking_status}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(booking.payment_status)}
                        >
                          {booking.payment_status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Start Time</p>
                          <p>{format(parseISO(booking.start_time), "PPp")}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">End Time</p>
                          <p>{format(parseISO(booking.end_time), "PPp")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {!Object.values(groupedBookings).some(
          (courtBookings) =>
            filterBookingsByDay(courtBookings, selectedDay).length > 0
        ) && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No bookings found for {selectedDay}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagementPage;
