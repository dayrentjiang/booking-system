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

// Define currency options
const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" }
];

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
  // Parse initial rate to separate currency and amounts
  const parseRate = (rateString: string) => {
    if (!rateString) return { currency: "USD", amounts: "" };
    const parts = rateString.split(" ");
    const currency = CURRENCIES.find((c) => c.code === parts[0])?.code || "USD";
    const amounts = parts[1] || "";
    return { currency, amounts };
  };

  const initialRate = parseRate(slot.rate);
  const [currency, setCurrency] = useState(initialRate.currency);
  const [amounts, setAmounts] = useState(initialRate.amounts);

  // Split time into hours and minutes
  const splitTime = (time: string) => {
    const [hour, minute] = time.split(":");
    return { hour, minute };
  };

  // Combine hours and minutes
  const combineTime = (hour: string, minute: string) => {
    return `${hour}:${minute}`;
  };

  // Handle price input changes
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmounts(e.target.value);
  };

  // Handle currency changes
  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    // Update the combined rate immediately
    const combinedRate = `${newCurrency} ${amounts}`;
    updateTimeSlot(type, slot.id, "rate", combinedRate);
  };

  // Handle price blur - combine currency and amounts
  const handlePriceBlur = () => {
    const combinedRate = `${currency} ${amounts}`;
    updateTimeSlot(type, slot.id, "rate", combinedRate);
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
        <div className="flex space-x-2">
          <div className="w-1/3">
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="$" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.symbol} ({curr.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Input
              type="text"
              value={amounts}
              onChange={handlePriceChange}
              onBlur={handlePriceBlur}
              placeholder="Enter prices (comma-separated)"
              className="w-full"
            />
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Tip: Enter multiple prices separated by commas
        </div>
      </div>
    </div>
  );
};

export default TimeSlotInput;
