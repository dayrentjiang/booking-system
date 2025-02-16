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
import { getAllBookingAction } from "@/actions/bookingAction/getAllBookingAction";
import { get } from "http";

const CalendarView = (props: { venueId: string; courtId: string }) => {
  const { venueId, courtId } = props;
  // BookingData.js
  const bookingsData = [
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
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [bookings] = useState(bookingsData);

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

  const hours = Array.from({ length: 19 }, (_, i) => i + 6);
  const HOUR_HEIGHT = 50;

  const getDaysInWeek = (startDate) => {
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = getDaysInWeek(weekStart);
  const today = new Date();

  const getBookingPosition = (booking) => {
    const startTime = parseISO(booking.start_time);
    const endTime = parseISO(booking.end_time);
    const startHour = startTime.getHours();
    const bookingDate = format(startTime, "yyyy-MM-dd");
    const duration = differenceInHours(endTime, startTime);

    return {
      startHour,
      duration,
      bookingDate,
      height: duration * HOUR_HEIGHT
    };
  };

  const handleNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const handlePrevWeek = () => setCurrentWeek(addWeeks(currentWeek, -1));
  const handleToday = () => setCurrentWeek(new Date());
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowDialog(true);
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
                  {format(new Date().setHours(hour, 0), "h:mm a")}
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
                    className="absolute left-0 right-0 m-1 text-sm bg-blue-100 border border-blue-300 rounded-md cursor-pointer hover:bg-blue-200 transition-colors"
                    style={{
                      top: `${topPosition}px`,
                      height: `${height}px`,
                      left: `${(dayIndex + 1) * (100 / 8)}%`,
                      right: `${100 - (dayIndex + 2) * (100 / 8)}%`
                    }}
                  >
                    <div className="p-2 h-full overflow-hidden">
                      <div className="font-medium text-blue-700">
                        Customer {booking.customer_id}
                      </div>
                      <div className="text-xs text-blue-600">
                        {format(parseISO(booking.start_time), "h:mm a")} -
                        {format(parseISO(booking.end_time), "h:mm a")}
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
                  {format(parseISO(selectedBooking.start_time), "PPp")} -{" "}
                  {format(parseISO(selectedBooking.end_time), "p")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Booking Status
                  </label>
                  <p className="mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {selectedBooking.booking_status}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Payment Status
                  </label>
                  <p className="mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {selectedBooking.payment_status}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
