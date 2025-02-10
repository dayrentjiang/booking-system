"use client";

import React from "react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { addCourtAction } from "@/actions/courtAction/addCourtAction";
import { getOwnerVenue } from "@/actions/getOwnerVenue";
import { Venue, Court } from "@/types/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash } from "lucide-react";
import { VenueCard } from "./VenueCard";

import { AddVenueDialog } from "./AddVenueDialog";
import { addVenueAction } from "@/actions/courtAction/addVenueAction";
import { add } from "date-fns";

// Main Page Component
const CourtsPage = (props: { venues: Venue[] }) => {
  const params = useParams();
  const userId = params?.userId as string;
  //   const [venues, setVenues] = React.useState([]);
  const [courts, setCourts] = React.useState([]);
  const [showAddVenue, setShowAddVenue] = React.useState(false);
  const [venues, setVenues] = useState<Venue[]>(props.venues);

  // Add this handler
  const handleAddVenue = async (formData: {
    name: string;
    address: string;
  }) => {
    try {
      const newVenue = await addVenueAction({
        ownerId: userId,
        name: formData.name,
        address: formData.address
      });

      if (newVenue) {
        // Optionally refresh the venues list or add the new venue to the state
        setVenues((prevVenues) => [...prevVenues, newVenue]);
      }
    } catch (error) {
      console.error("Error adding venue:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Venue Management</h1>
          <p className="text-gray-600">Manage your venues and courts</p>
        </div>
        <Button onClick={() => setShowAddVenue(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Venue
        </Button>
      </div>

      <div className="space-y-6">
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            // courts={courts.filter((court) => court.venue_id === venue.id)}
            onAddCourt={() => {
              /* Add court handler */
            }}
          />
        ))}
      </div>

      {/* Add Venue Dialog */}
      <AddVenueDialog
        open={showAddVenue}
        onClose={() => setShowAddVenue(false)}
        onSubmit={handleAddVenue}
      />
    </div>
  );
};

export default CourtsPage;
