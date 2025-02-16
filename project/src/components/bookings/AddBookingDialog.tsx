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
  DUMMY_EXISTING_BOOKINGS,
  Customer
} from "@/types/dummy";
import { format } from "date-fns";

interface AddBookingDialogProps {
  venues: Venue[];
}
const AddBookingDialog: React.FC<AddBookingDialogProps> = ({ venues }) => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [selectedCourt, setSelectedCourt] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringEndDate, setRecurringEndDate] = useState<Date | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [availabilityMessage, setAvailabilityMessage] = useState<string>("");

  // Utility functions
  const isTimeSlotAvailable = (timeSlot: string) => {
    if (!selectedDate || !selectedCourt) return true;

    const [start, end] = timeSlot.split("-");
    const bookingStart = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${start}`
    );
    const bookingEnd = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${end}`);

    return !DUMMY_EXISTING_BOOKINGS.some((booking) => {
      if (booking.court_id !== selectedCourt) return false;

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
    if (!selectedDate || !selectedCourt || !selectedTimeSlots.length) return 0;

    // Determine day type
    const dayType =
      selectedDate.getDay() === 0 || selectedDate.getDay() === 6
        ? "weekend"
        : "weekday";

    // Get all pricing rules for this court and day type
    const pricing = DUMMY_COURT_PRICING.filter(
      (price) => price.court_id === selectedCourt && price.day_type === dayType
    );

    let totalPrice = 0;

    // Sort time slots to ensure proper order
    const sortedTimeSlots = [...selectedTimeSlots].sort();

    sortedTimeSlots.forEach((slot) => {
      const [slotStart, slotEnd] = slot.split("-");

      // Find the applicable pricing rule for this time slot
      const applicablePricing = pricing.find((price) => {
        // Convert times to comparable format (24-hour)
        const priceStart = price.start_time;
        const priceEnd = price.end_time;

        // Check if the slot falls within this pricing period
        return slotStart >= priceStart && slotEnd <= priceEnd;
      });

      if (applicablePricing) {
        // Add the rate for this hour
        totalPrice += parseFloat(applicablePricing.rate);
      } else {
        console.warn(`No pricing rule found for slot ${slot} on ${dayType}`);
      }
    });

    return totalPrice;
  };

  // Event handlers
  const handleTimeSlotSelect = (timeSlot: string) => {
    if (!selectedDate || !selectedCourt) {
      setAvailabilityMessage("Please select a date and court first");
      return;
    }

    setSelectedTimeSlots((prev) => {
      const newSlots = prev.includes(timeSlot)
        ? prev.filter((slot) => slot !== timeSlot)
        : [...prev, timeSlot].sort();

      // Update estimated price
      const price = calculatePrice();
      setEstimatedPrice(price);

      return newSlots;
    });

    setAvailabilityMessage("");
  };

  const handleNewCustomerAdd = (
    customerData: Omit<Customer, "id" | "created_at" | "updated_at">
  ) => {
    const newCustomerId = `new_${Date.now()}`;
    console.log("Adding new customer:", { id: newCustomerId, ...customerData });
    setSelectedCustomer(newCustomerId);
  };

  const handleSubmit = () => {
    // Generate bookings logic here
    console.log("Creating booking with:", {
      customer: selectedCustomer,
      venue: selectedVenue,
      court: selectedCourt,
      date: selectedDate,
      timeSlots: selectedTimeSlots,
      isRecurring,
      recurringEndDate,
      estimatedPrice
    });

    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedVenue("");
    setSelectedCourt("");
    setSelectedCustomer("");
    setSelectedDate(null);
    setIsRecurring(false);
    setRecurringEndDate(null);
    setSelectedTimeSlots([]);
    setEstimatedPrice(0);
    setAvailabilityMessage("");
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
            selectedCustomer={selectedCustomer}
            onCustomerSelect={setSelectedCustomer}
            onNewCustomerAdd={handleNewCustomerAdd}
          />

          <VenueCourtSelection
            venues={venues}
            selectedVenue={selectedVenue}
            selectedCourt={selectedCourt}
            onVenueSelect={setSelectedVenue}
            onCourtSelect={setSelectedCourt}
          />

          <DateTimeSelection
            selectedDate={selectedDate}
            isRecurring={isRecurring}
            recurringEndDate={recurringEndDate}
            selectedTimeSlots={selectedTimeSlots}
            availabilityMessage={availabilityMessage}
            onDateSelect={setSelectedDate}
            onRecurringChange={setIsRecurring}
            onRecurringEndDateSelect={setRecurringEndDate}
            onTimeSlotSelect={handleTimeSlotSelect}
            isTimeSlotAvailable={isTimeSlotAvailable}
          />

          <BookingSummary
            selectedTimeSlots={selectedTimeSlots}
            selectedDate={selectedDate}
            selectedCourt={selectedCourt}
            isRecurring={isRecurring}
            recurringEndDate={recurringEndDate}
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
            <Button
              onClick={handleSubmit}
              disabled={
                !selectedVenue ||
                !selectedCourt ||
                !selectedDate ||
                !selectedTimeSlots.length ||
                !selectedCustomer ||
                (isRecurring && !recurringEndDate)
              }
            >
              Create Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingDialog;
