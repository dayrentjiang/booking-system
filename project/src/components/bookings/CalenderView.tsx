import React, { useEffect, useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  parseISO,
  differenceInHours,
  isSameDay
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllBookingAction } from "@/services/booking/booking";
import { Booking } from "@/lib/types";

const CalendarView = (props: { venueId: string; courtId: string }) => {
  const { venueId, courtId } = props;
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const data = await getAllBookingAction(courtId);
        if (data) {
          setBookings(data);
        }
      } catch (error) {
        console.error("Error in getBookings:", error);
      }
    };

    if (courtId) {
      getBookings();
    }
  }, [courtId]);

  const hours = Array.from({ length: 19 }, (_, i) => i + 6);
  const HOUR_HEIGHT = 60; // Increased height for better visibility

  const getDaysInWeek = (startDate: Date) => {
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = getDaysInWeek(weekStart);
  const today = new Date();

  // Function to extract hours and minutes from time string
  const getTimeComponents = (timeStr: string | null | undefined) => {
    if (!timeStr) {
      console.error("Invalid time string:", timeStr);
      return { hours: 0, minutes: 0 };
    }

    try {
      let timePart: string;

      if (timeStr.includes("T")) {
        // Handle ISO format
        timePart = timeStr.split("T")[1].substring(0, 5); // Get HH:mm
      } else {
        // Handle space-separated format
        timePart = timeStr.split(" ")[1].substring(0, 5); // Get HH:mm
      }

      const [hours, minutes] = timePart.split(":").map(Number);

      return {
        hours: isNaN(hours) ? 0 : hours,
        minutes: isNaN(minutes) ? 0 : minutes
      };
    } catch (error) {
      console.error("Error parsing time:", timeStr, error);
      return { hours: 0, minutes: 0 };
    }
  };

  const getBookingPosition = (booking: Booking) => {
    if (!booking || !booking.start_time || !booking.end_time) {
      console.error("Invalid booking:", booking);
      return {
        startHour: 0,
        duration: 0,
        bookingDate: "",
        height: 0
      };
    }

    try {
      const startComponents = getTimeComponents(booking.start_time);
      const endComponents = getTimeComponents(booking.end_time);
      const startHour = startComponents.hours + startComponents.minutes / 60;
      const endHour = endComponents.hours + endComponents.minutes / 60;
      const duration = endHour - startHour;

      // Extract date part from either ISO or space-separated format
      const bookingDate = booking.start_time.includes("T")
        ? booking.start_time.split("T")[0]
        : booking.start_time.split(" ")[0];

      return {
        startHour,
        duration,
        bookingDate,
        height: Math.max(duration * HOUR_HEIGHT, 0) // Ensure non-negative height
      };
    } catch (error) {
      console.error("Error calculating booking position:", error);
      return {
        startHour: 0,
        duration: 0,
        bookingDate: "",
        height: 0
      };
    }
  };

  const handleNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const handlePrevWeek = () => setCurrentWeek(addWeeks(currentWeek, -1));
  const handleToday = () => setCurrentWeek(new Date());
  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to format time without timezone conversion
  const formatTimeDisplay = (timeStr: string | null | undefined) => {
    if (!timeStr) {
      console.error("Invalid time string:", timeStr);
      return "";
    }

    try {
      let timePart: string;

      if (timeStr.includes("T")) {
        // Handle ISO format
        timePart = timeStr.split("T")[1].substring(0, 5); // Get HH:mm
      } else {
        // Handle space-separated format
        timePart = timeStr.split(" ")[1].substring(0, 5); // Get HH:mm
      }

      const [hours, minutes] = timePart.split(":");
      const hour = parseInt(hours, 10);

      if (isNaN(hour)) {
        console.error("Invalid hour:", hours);
        return "";
      }

      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      console.error("Error formatting time:", timeStr, error);
      return "";
    }
  };

  return (
    <div className="h-screen flex flex-col p-4 max-w-7xl mx-auto">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Week of {format(weekStart, "MMMM d, yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="flex items-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" />
            Today
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

      {/* Calendar Grid */}
      <div className="flex-1 border rounded-lg bg-white shadow overflow-hidden">
        <div className="grid grid-cols-8 border-b bg-gray-50">
          <div className="p-2 border-r" />
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className={`p-2 text-center border-r font-medium ${
                isSameDay(day, today) ? "bg-blue-50" : ""
              }`}
            >
              <div className="text-sm text-gray-600">{format(day, "EEE")}</div>
              <div
                className={`text-base ${
                  isSameDay(day, today) ? "text-blue-600" : "text-gray-900"
                }`}
              >
                {format(day, "MMM d")}
              </div>
            </div>
          ))}
        </div>

        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="relative">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b">
                <div className="p-2 border-r text-sm sticky left-0 bg-gray-50">
                  {`${hour % 12 || 12}:00 ${hour >= 12 ? "PM" : "AM"}`}
                </div>
                {weekDays.map((day) => (
                  <div
                    key={`${day}-${hour}`}
                    className="p-2 border-r"
                    style={{ height: `${HOUR_HEIGHT}px` }}
                  />
                ))}
              </div>
            ))}

            {/* Overlay bookings */}
            {weekDays.map((day, dayIndex) => {
              const currentDate = format(day, "yyyy-MM-dd");
              const dayBookings = bookings.filter((booking) => {
                const { bookingDate } = getBookingPosition(booking);
                return bookingDate === currentDate;
              });

              return dayBookings.map((booking) => {
                const { startHour, duration, height } =
                  getBookingPosition(booking);
                const topPosition = (startHour - 6) * HOUR_HEIGHT;

                return (
                  <div
                    key={booking.id}
                    onClick={() => handleBookingClick(booking)}
                    className={`absolute left-0 right-0 mx-0 text-sm border rounded-md cursor-pointer hover:opacity-80 transition-colors ${
                      booking.booking_status === "confirmed"
                        ? "bg-blue-100 border-blue-300"
                        : booking.booking_status === "pending"
                        ? "bg-yellow-100 border-yellow-300"
                        : "bg-red-100 border-red-300"
                    }`}
                    style={{
                      top: `${topPosition}px`,
                      height: `${height - 2}px`, // Subtract 2px for borders
                      left: `${(dayIndex + 1) * (100 / 8)}%`,
                      right: `${100 - (dayIndex + 2) * (100 / 8)}%`,
                      borderTop: "1px solid",
                      borderBottom: "1px solid"
                    }}
                  >
                    <div className="p-2 h-full overflow-hidden">
                      <div className="font-medium">
                        Customer {booking.customer_id}
                      </div>
                      <div className="text-xs">
                        {formatTimeDisplay(booking.start_time)} -
                        {formatTimeDisplay(booking.end_time)}
                      </div>
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Booking ID
                  </label>
                  <p className="mt-1">{selectedBooking.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Customer ID
                  </label>
                  <p className="mt-1">{selectedBooking.customer_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Court ID
                  </label>
                  <p className="mt-1">{selectedBooking.court_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Total Amount
                  </label>
                  <p className="mt-1">${selectedBooking.total_amount}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Time
                </label>
                <p className="mt-1">
                  {selectedBooking.start_time} - {selectedBooking.end_time}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Booking Status
                  </label>
                  <p
                    className={`mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedBooking.booking_status
                    )}`}
                  >
                    {selectedBooking.booking_status}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Payment Status
                  </label>
                  <p
                    className={`mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedBooking.payment_status
                    )}`}
                  >
                    {selectedBooking.payment_status}
                  </p>
                </div>
              </div>

              {selectedBooking.is_recurring && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Recurring Booking
                  </label>
                  <p className="mt-1">
                    Ends on:{" "}
                    {selectedBooking.recurring_end_date || "No end date"}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
