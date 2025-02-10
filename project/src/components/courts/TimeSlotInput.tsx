import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { time_slot } from "@/types/types";

// Generate hours for 24-hour format
const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);
// Generate minutes in 15-minute increments
const minutes = ["00", "15", "30", "45"];

const TimeSlotInput = ({
  slot,
  type,
  updateTimeSlot
}: {
  slot: time_slot;
  type: "weekday" | "weekend";
  updateTimeSlot: (
    type: "weekday" | "weekend",
    id: string,
    field: keyof time_slot,
    value: string
  ) => void;
}) => {
  const [localRate, setLocalRate] = useState(slot.rate);

  // Split time into hours and minutes
  const splitTime = (time: string) => {
    const [hour, minute] = time.split(":");
    return { hour, minute };
  };

  // Combine hours and minutes
  const combineTime = (hour: string, minute: string) => {
    return `${hour}:${minute}`;
  };

  // Update price input to handle multiple values
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalRate(value);
  };

  const handlePriceBlur = () => {
    updateTimeSlot(type, slot.id, "rate", localRate);
  };

  const { hour: startHour, minute: startMinute } = splitTime(
    slot.start_time || "00:00"
  );
  const { hour: endHour, minute: endMinute } = splitTime(
    slot.end_time || "00:00"
  );

  return (
    <div className="grid grid-cols-3 gap-4 flex-1">
      {/* Start Time Input */}
      <div className="space-y-2">
        <Label>Start Time</Label>
        <div className="flex space-x-2">
          <Select
            value={startHour}
            onValueChange={(hour) => {
              const newTime = combineTime(hour, startMinute);
              updateTimeSlot(type, slot.id, "start_time", newTime);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={startMinute}
            onValueChange={(minute) => {
              const newTime = combineTime(startHour, minute);
              updateTimeSlot(type, slot.id, "start_time", newTime);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* End Time Input */}
      <div className="space-y-2">
        <Label>End Time</Label>
        <div className="flex space-x-2">
          <Select
            value={endHour}
            onValueChange={(hour) => {
              const newTime = combineTime(hour, endMinute);
              updateTimeSlot(type, slot.id, "end_time", newTime);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={endMinute}
            onValueChange={(minute) => {
              const newTime = combineTime(endHour, minute);
              updateTimeSlot(type, slot.id, "end_time", newTime);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price per Hour Input */}
      <div className="space-y-2">
        <Label>Price per Hour</Label>
        <Input
          type="text"
          value={localRate}
          onChange={handlePriceChange}
          onBlur={handlePriceBlur}
          placeholder="Enter prices (comma-separated)"
          className="w-full"
        />
        <div className="text-xs text-gray-500">
          Tip: Enter multiple prices separated by commas
        </div>
      </div>
    </div>
  );
};

export default TimeSlotInput;
