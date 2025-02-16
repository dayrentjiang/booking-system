// components/VenueCourtSelection.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Venue } from "@/types/dummy";

interface VenueCourtSelectionProps {
  venues: Venue[];
  selectedVenue: string;
  selectedCourt: string;
  onVenueSelect: (venueId: string) => void;
  onCourtSelect: (courtId: string) => void;
}

export const VenueCourtSelection: React.FC<VenueCourtSelectionProps> = ({
  venues,
  selectedVenue,
  selectedCourt,
  onVenueSelect,
  onCourtSelect
}) => {
  const selectedVenueData = venues.find((v) => v.id === selectedVenue);
  const availableCourts = selectedVenueData?.courts || [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-4">
        <Label className="mb-3 block">Select Venue</Label>
        <Select
          value={selectedVenue}
          onValueChange={(value) => {
            onVenueSelect(value);
            onCourtSelect("");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a venue" />
          </SelectTrigger>
          <SelectContent>
            {venues.map((venue) => (
              <SelectItem key={venue.id} value={venue.id}>
                {venue.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Card className="p-4">
        <Label className="mb-3 block">Select Court</Label>
        <Select
          value={selectedCourt}
          onValueChange={onCourtSelect}
          disabled={!selectedVenue}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                selectedVenue ? "Choose a court" : "Select venue first"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {availableCourts.map((court) => (
              <SelectItem key={court.id} value={court.id}>
                {court.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>
    </div>
  );
};
