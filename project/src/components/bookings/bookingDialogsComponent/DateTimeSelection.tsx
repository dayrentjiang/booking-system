// components/DateTimeSelection.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";
import { format, addDays } from "date-fns";
import { TIME_SLOTS } from "@/types/dummy";

interface DateTimeSelectionProps {
  selectedDate: Date | null;
  isRecurring: boolean;
  recurringEndDate: Date | null;
  selectedTimeSlots: string[];
  availabilityMessage: string;
  onDateSelect: (date: Date | null) => void;
  onRecurringChange: (isRecurring: boolean) => void;
  onRecurringEndDateSelect: (date: Date | null) => void;
  onTimeSlotSelect: (timeSlot: string) => void;
  isTimeSlotAvailable: (slot: string) => boolean;
}

export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedDate,
  isRecurring,
  recurringEndDate,
  selectedTimeSlots,
  availabilityMessage,
  onDateSelect,
  onRecurringChange,
  onRecurringEndDateSelect,
  onTimeSlotSelect,
  isTimeSlotAvailable
}) => {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <Label className="mb-3 block">Select Date</Label>
          <div className="relative">
            <input
              type="date"
              className="w-full p-2 border rounded-md pr-20"
              value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                onDateSelect(date);
              }}
              min={format(new Date(), "yyyy-MM-dd")}
            />
            {selectedDate && (
              <X
                className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => onDateSelect(null)}
              />
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Recurring Schedule</Label>
                <p className="text-sm text-gray-500">
                  Create weekly recurring bookings
                </p>
              </div>
              <Switch
                checked={isRecurring}
                onCheckedChange={onRecurringChange}
              />
            </div>

            {isRecurring && (
              <div className="pt-4 border-t">
                <Label className="mb-3 block">
                  End Date for Recurring Booking
                </Label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  value={
                    recurringEndDate
                      ? format(recurringEndDate, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    onRecurringEndDateSelect(date);
                  }}
                  min={
                    selectedDate
                      ? format(addDays(selectedDate, 7), "yyyy-MM-dd")
                      : ""
                  }
                />
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <Label className="mb-3 block">Select Time Slots</Label>
        {availabilityMessage && (
          <Alert className="mb-4">
            <AlertDescription>{availabilityMessage}</AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isAvailable = isTimeSlotAvailable(slot);
            const isSelected = selectedTimeSlots.includes(slot);

            return (
              <Button
                key={slot}
                variant={isSelected ? "default" : "outline"}
                className={`p-2 text-sm ${
                  !isAvailable
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => onTimeSlotSelect(slot)}
                disabled={!isAvailable || !selectedDate}
              >
                {slot}
              </Button>
            );
          })}
        </div>
      </Card>
    </>
  );
};
