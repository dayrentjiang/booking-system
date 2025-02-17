// components/AddBookingDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CustomerSelection } from "./bookingDialogsComponent/CustomerSelection";
import { VenueCourtSelection } from "./bookingDialogsComponent/VenueCourtSelection";
import { DateTimeSelection } from "./bookingDialogsComponent/DateTimeSelection";
import { BookingSummary } from "./bookingDialogsComponent/BookingSummary";
import {
  Venue,
  DUMMY_COURT_PRICING,
  DUMMY_EXISTING_BOOKINGS
} from "@/types/dummy";
import { format } from "date-fns";
import { addNewBooking } from "@/app/actions/booking/bookingAction";
import { BookingFormData } from "@/types/interface";

interface AddBookingDialogProps {
  venues: Venue[];
}

const AddBookingDialog: React.FC<AddBookingDialogProps> = ({ venues }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    customerInfo: {
      name: "",
      email: "",
      phone: ""
    },
    venueId: "",
    courtId: "",
    date: null,
    isRecurring: false,
    recurringEndDate: null,
    timeSlots: [],
    estimatedPrice: 0
  });

  const [availabilityMessage, setAvailabilityMessage] = useState<string>("");

  const isTimeSlotAvailable = (timeSlot: string) => {
    if (!bookingData.date || !bookingData.courtId) return true;

    const [start, end] = timeSlot.split("-");
    const bookingStart = new Date(
      `${format(bookingData.date, "yyyy-MM-dd")}T${start}`
    );
    const bookingEnd = new Date(
      `${format(bookingData.date, "yyyy-MM-dd")}T${end}`
    );

    return !DUMMY_EXISTING_BOOKINGS.some((booking) => {
      if (booking.court_id !== bookingData.courtId) return false;
      const existingStart = new Date(booking.start_time);
      const existingEnd = new Date(booking.end_time);

      return (
        (bookingStart >= existingStart && bookingStart < existingEnd) ||
        (bookingEnd > existingStart && bookingEnd <= existingEnd) ||
        (bookingStart <= existingStart && bookingEnd >= existingEnd)
      );
    });
  };

  const calculatePrice = () => {
    if (
      !bookingData.date ||
      !bookingData.courtId ||
      !bookingData.timeSlots.length
    )
      return 0;

    const dayType =
      bookingData.date.getDay() === 0 || bookingData.date.getDay() === 6
        ? "weekend"
        : "weekday";

    const pricing = DUMMY_COURT_PRICING.filter(
      (price) =>
        price.court_id === bookingData.courtId && price.day_type === dayType
    );

    let totalPrice = 0;
    const sortedTimeSlots = [...bookingData.timeSlots].sort();

    sortedTimeSlots.forEach((slot) => {
      const [slotStart, slotEnd] = slot.split("-");
      const applicablePricing = pricing.find((price) => {
        return slotStart >= price.start_time && slotEnd <= price.end_time;
      });

      if (applicablePricing) {
        totalPrice += parseFloat(applicablePricing.rate);
      }
    });

    return totalPrice;
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    if (!bookingData.date || !bookingData.courtId) {
      setAvailabilityMessage("Please select a date and court first");
      return;
    }

    setBookingData((prev) => {
      const newTimeSlots = prev.timeSlots.includes(timeSlot)
        ? prev.timeSlots.filter((slot) => slot !== timeSlot)
        : [...prev.timeSlots, timeSlot].sort();

      return {
        ...prev,
        timeSlots: newTimeSlots,
        estimatedPrice: calculatePrice()
      };
    });
    setAvailabilityMessage("");
  };

  const handleSubmit = async () => {
    try {
      console.log("Creating booking:", bookingData);
      await addNewBooking(bookingData);
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const resetForm = () => {
    setBookingData({
      customerInfo: {
        name: "",
        email: "",
        phone: ""
      },
      venueId: "",
      courtId: "",
      date: null,
      isRecurring: false,
      recurringEndDate: null,
      timeSlots: [],
      estimatedPrice: 0
    });
    setAvailabilityMessage("");
  };

  const isFormValid = () => {
    return (
      bookingData.customerInfo.name &&
      bookingData.customerInfo.email &&
      bookingData.customerInfo.phone &&
      bookingData.venueId &&
      bookingData.courtId &&
      bookingData.date &&
      bookingData.timeSlots.length > 0 &&
      (!bookingData.isRecurring || bookingData.recurringEndDate)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <CustomerSelection
            customerInfo={bookingData.customerInfo}
            onCustomerInfoChange={(info) =>
              setBookingData((prev) => ({ ...prev, customerInfo: info }))
            }
          />

          <VenueCourtSelection
            venues={venues}
            selectedVenue={bookingData.venueId}
            selectedCourt={bookingData.courtId}
            onVenueSelect={(id) =>
              setBookingData((prev) => ({ ...prev, venueId: id, courtId: "" }))
            }
            onCourtSelect={(id) =>
              setBookingData((prev) => ({ ...prev, courtId: id }))
            }
          />

          <DateTimeSelection
            selectedDate={bookingData.date}
            isRecurring={bookingData.isRecurring}
            recurringEndDate={bookingData.recurringEndDate}
            selectedTimeSlots={bookingData.timeSlots}
            availabilityMessage={availabilityMessage}
            onDateSelect={(date) =>
              setBookingData((prev) => ({ ...prev, date }))
            }
            onRecurringChange={(isRecurring) =>
              setBookingData((prev) => ({ ...prev, isRecurring }))
            }
            onRecurringEndDateSelect={(date) =>
              setBookingData((prev) => ({ ...prev, recurringEndDate: date }))
            }
            onTimeSlotSelect={handleTimeSlotSelect}
            isTimeSlotAvailable={isTimeSlotAvailable}
          />

          <BookingSummary
            selectedTimeSlots={bookingData.timeSlots}
            selectedDate={bookingData.date}
            selectedCourt={bookingData.courtId}
            isRecurring={bookingData.isRecurring}
            recurringEndDate={bookingData.recurringEndDate}
          />

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid()}>
              Create Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingDialog;
