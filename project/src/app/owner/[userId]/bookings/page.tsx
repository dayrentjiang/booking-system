"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookingManagementPage from "@/components/bookings/BookingManagementPage";
import CalendarView from "@/components/bookings/CalenderView";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarDays, List, Plus, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { getVenuesWithCourt } from "@/actions/bookingAction/getVenuesWithCourt";
import { useParams } from "next/navigation";
import AddBookingDialog from "@/components/bookings/AddBookingDialog";

// Define types for better type safety
interface Court {
  id: string;
  name: string;
}

interface Venue {
  id: string;
  name: string;
  courts: Court[];
}

function MainBookingPage() {
  // Get userId from URL and provide a type-safe fallback
  const params = useParams();
  const userId = params?.userId as string;

  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [selectedCourt, setSelectedCourt] = useState<string>("");
  const [venuesDatas, setVenuesDatas] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get currently selected venue object
  const currentVenue = venuesDatas.find((venue) => venue.id === selectedVenue);

  // Handle venue change
  const handleVenueChange = (venueId: string) => {
    setSelectedVenue(venueId);
    const venue = venuesDatas.find((v) => v.id === venueId);
    if (venue?.courts && venue.courts.length > 0) {
      setSelectedCourt(venue.courts[0].id);
    }
  };

  // Fetch venues data
  useEffect(() => {
    const fetchVenuesData = async () => {
      if (!userId) {
        setError("No user ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getVenuesWithCourt(userId);

        if (!data || data.length === 0) {
          setError("No venues found");
          return;
        }

        setVenuesDatas(data);
        setSelectedVenue(data[0].id);
        if (data[0].courts?.length > 0) {
          setSelectedCourt(data[0].courts[0].id);
        }
      } catch (error) {
        setError("Failed to fetch venues data");
        console.error("Failed to fetch venues data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenuesData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-[1400px] mx-auto space-y-4">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Booking Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage and view all court bookings
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <AddBookingDialog venues={venuesDatas} />
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>

              <div className="flex rounded-lg border border-gray-200 bg-white">
                <Button
                  variant="ghost"
                  className={`flex items-center gap-2 rounded-r-none ${
                    viewMode === "calendar" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setViewMode("calendar")}
                >
                  <CalendarDays className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </Button>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-2 rounded-l-none border-l ${
                    viewMode === "list" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Venue and Court Selection */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500 mb-1.5 block">
                Select Venue
              </label>
              <Select value={selectedVenue} onValueChange={handleVenueChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {venuesDatas.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500 mb-1.5 block">
                Select Court
              </label>
              <Select
                value={selectedCourt}
                onValueChange={setSelectedCourt}
                disabled={!currentVenue || !currentVenue.courts?.length}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentVenue?.courts?.map((court) => (
                    <SelectItem key={court.id} value={court.id}>
                      {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-white shadow-sm">
          {viewMode === "calendar" ? (
            <CalendarView venueId={selectedVenue} courtId={selectedCourt} />
          ) : (
            <BookingManagementPage
              venueId={selectedVenue}
              courtId={selectedCourt}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default MainBookingPage;
