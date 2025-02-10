import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import { sport_type, time_slot } from "@/types/types";

interface PricingSchedule {
  [key: string]: time_slot[];
}

interface AddCourtDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  venueId: string;
  sportTypes: sport_type[];
}

export const AddCourtDialog = ({
  open,
  onClose,
  onSubmit,
  venueId,
  sportTypes
}: AddCourtDialogProps) => {
  const [formData, setFormData] = React.useState({
    name: "",
    sport_type_id: "",
    pricing: {
      weekday: [] as time_slot[],
      weekend: [] as time_slot[]
    },
    hasRacketRental: false,
    racketRentalPrice: ""
  });

  const addTimeSlot = (scheduleType: "weekday" | "weekend") => {
    const newSlot: time_slot = {
      id: crypto.randomUUID(),
      start_time: "",
      end_time: "",
      rate: ""
    };

    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [scheduleType]: [...prev.pricing[scheduleType], newSlot]
      }
    }));
  };

  const removeTimeSlot = (
    scheduleType: "weekday" | "weekend",
    slotId: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [scheduleType]: prev.pricing[scheduleType].filter(
          (slot) => slot.id !== slotId
        )
      }
    }));
  };

  const updateTimeSlot = (
    scheduleType: "weekday" | "weekend",
    slotId: string,
    field: keyof time_slot,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [scheduleType]: prev.pricing[scheduleType].map((slot) =>
          slot.id === slotId ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, venue_id: venueId });
    onClose();
    // Reset form
    setFormData({
      name: "",
      sport_type_id: "",
      pricing: {
        weekday: [] as time_slot[],
        weekend: [] as time_slot[]
      },
      hasRacketRental: false,
      racketRentalPrice: ""
    });
  };

  const TimeSlotSection = ({
    type,
    slots
  }: {
    type: "weekday" | "weekend";
    slots: time_slot[];
  }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">
          {type === "weekday" ? "Weekday" : "Weekend"} Pricing
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addTimeSlot(type)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Time Slot
        </Button>
      </div>

      <div className="space-y-4">
        {slots.map((slot) => (
          <div key={slot.id} className="flex gap-4 items-start">
            <div className="grid grid-cols-3 gap-4 flex-1">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={slot.start_time}
                  onChange={(e) =>
                    updateTimeSlot(type, slot.id, "start_time", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={slot.end_time}
                  onChange={(e) =>
                    updateTimeSlot(type, slot.id, "end_time", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Price per Hour</Label>
                <Input
                  type="number"
                  value={slot.rate}
                  onChange={(e) =>
                    updateTimeSlot(type, slot.id, "rate", e.target.value)
                  }
                  placeholder="Price per hour"
                  step="any"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-6"
              onClick={() => removeTimeSlot(type, slot.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Court</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Court Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter court name"
              />
            </div>
            <div>
              <Label>Sport Type</Label>
              <Select
                value={formData.sport_type_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, sport_type_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sport type" />
                </SelectTrigger>
                <SelectContent>
                  {sportTypes?.map((sport) => (
                    <SelectItem key={sport.id} value={sport.id}>
                      {sport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TimeSlotSection type="weekday" slots={formData.pricing.weekday} />
          <TimeSlotSection type="weekend" slots={formData.pricing.weekend} />

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.hasRacketRental}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, hasRacketRental: checked })
                }
              />
              <Label>Enable Racket Rental</Label>
            </div>

            {formData.hasRacketRental && (
              <div className="w-48">
                <Label>Racket Rental Price (per hour)</Label>
                <Input
                  type="number"
                  value={formData.racketRentalPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      racketRentalPrice: e.target.value
                    })
                  }
                  placeholder="Rental price per hour"
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Add Court
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
