// components/BookingSummary.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { DUMMY_COURT_PRICING } from "@/types/dummy";

interface BookingSummaryProps {
  selectedTimeSlots: string[];
  selectedDate: Date | null;
  selectedCourt: string;
  isRecurring: boolean;
  recurringEndDate: Date | null;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedTimeSlots,
  selectedDate,
  selectedCourt,
  isRecurring,
  recurringEndDate
}) => {
  if (selectedTimeSlots.length === 0 || !selectedDate) return null;

  // Calculate price breakdown
  const dayType =
    selectedDate.getDay() === 0 || selectedDate.getDay() === 6
      ? "weekend"
      : "weekday";
  const pricing = DUMMY_COURT_PRICING.filter(
    (price) => price.court_id === selectedCourt && price.day_type === dayType
  );

  const priceBreakdown = selectedTimeSlots.map((slot) => {
    const [start, end] = slot.split("-");
    const applicablePricing = pricing.find(
      (price) => start >= price.start_time && end <= price.end_time
    );
    return {
      slot,
      rate: applicablePricing ? parseFloat(applicablePricing.rate) : 0
    };
  });

  const totalPrice = priceBreakdown.reduce((sum, item) => sum + item.rate, 0);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Date:</span>
          <span className="font-medium">
            {format(selectedDate, "MMM dd, yyyy")} ({dayType})
          </span>
        </div>
        <div className="flex justify-between">
          <span>Selected Time Slots:</span>
          <span className="font-medium">{selectedTimeSlots.join(", ")}</span>
        </div>
        <div className="flex justify-between">
          <span>Duration:</span>
          <span className="font-medium">
            {selectedTimeSlots.length} hour(s)
          </span>
        </div>

        {/* Price Breakdown */}
        <div className="pt-2 border-t">
          <h4 className="font-medium mb-2">Price Breakdown:</h4>
          <div className="space-y-1">
            {priceBreakdown.map(({ slot, rate }, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{slot}</span>
                <span>${rate.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t mt-2">
            <span>Total Price:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {isRecurring && recurringEndDate && (
          <div className="flex justify-between pt-2 border-t mt-2">
            <span>Recurring Until:</span>
            <span className="font-medium">
              {format(recurringEndDate, "MMM dd, yyyy")}
            </span>
          </div>
        )}

        {isRecurring && recurringEndDate && (
          <div className="flex justify-between font-semibold">
            <span>Total for All Sessions:</span>
            <span>
              $
              {(
                totalPrice *
                Math.ceil(
                  (recurringEndDate.getTime() - selectedDate.getTime()) /
                    (7 * 24 * 60 * 60 * 1000)
                )
              ).toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
