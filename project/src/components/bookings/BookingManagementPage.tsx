import React, { useEffect, useState } from "react";
import {
  format,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay
} from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getAllBookingAction } from "@/services/booking/booking";
import { Input } from "@/components/ui/input";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface Booking {
  id: string;
  customer_id: string;
  court_id: string;
  start_time: string; // "2025-02-12 14:00:00" format
  end_time: string; // "2025-02-12 17:00:00" format
  created_at: string;
  updated_at: string;
  booking_status: "pending" | "confirmed" | "cancelled";
  payment_status: "pending" | "confirmed" | "refunded";
  total_amount: number;
  is_recurring?: boolean;
  recurring_end_date?: string | null;
}

const BookingList = (props: { venueId: string; courtId: string }) => {
  const { venueId, courtId } = props;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });

  useEffect(() => {
    const getBookings = async () => {
      try {
        const data = await getAllBookingAction(courtId);
        if (data) {
          setBookings(data);
          setFilteredBookings(data);
        }
      } catch (error) {
        console.error("Error in getBookings:", error);
      }
    };

    if (courtId) {
      getBookings();
    }
  }, [courtId]);

  useEffect(() => {
    let filtered = bookings;

    // Apply date range filter
    if (date?.from || date?.to) {
      filtered = filtered.filter((booking) => {
        const bookingDate = parseISO(booking.start_time.replace(" ", "T"));
        if (date.from && date.to) {
          return isWithinInterval(bookingDate, {
            start: startOfDay(date.from),
            end: endOfDay(date.to)
          });
        }
        return true;
      });
    }

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter((booking) =>
        Object.values(booking).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredBookings(filtered);
  }, [searchTerm, bookings, date]);

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

  const formatDateTime = (dateTimeStr: string) => {
    try {
      return format(
        parseISO(dateTimeStr.replace(" ", "T")),
        "yyyy-MM-dd HH:mm:ss"
      );
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateTimeStr;
    }
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDialog(true);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Search and Date Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex-shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-[300px]",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Booking Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>{booking.customer_id}</TableCell>
                <TableCell>{formatDateTime(booking.start_time)}</TableCell>
                <TableCell>{formatDateTime(booking.end_time)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      booking.booking_status
                    )}`}
                  >
                    {booking.booking_status}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      booking.payment_status
                    )}`}
                  >
                    {booking.payment_status}
                  </span>
                </TableCell>
                <TableCell>${booking.total_amount}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBookingClick(booking)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                  {formatDateTime(selectedBooking.start_time)} -{" "}
                  {formatDateTime(selectedBooking.end_time)}
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
                    {selectedBooking.recurring_end_date
                      ? formatDateTime(selectedBooking.recurring_end_date)
                      : "No end date"}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Created At
                </label>
                <p className="mt-1">
                  {formatDateTime(selectedBooking.created_at)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Updated At
                </label>
                <p className="mt-1">
                  {formatDateTime(selectedBooking.updated_at)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingList;
