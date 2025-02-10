import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getCourtAction } from "@/actions/courtAction/getCourtAction";
import { addCourtAction } from "@/actions/courtAction/addCourtAction";
import { getSportType } from "@/actions/courtAction/getSportType";
import CourtCard from "@/components/courts/CourtCard";
import React from "react";
import AddCourtDialog from "@/components/courts/AddCourtDialog";

import { Venue, Court } from "@/types/types";
import { add } from "date-fns";
import { revalidatePath } from "next/cache";

interface VenueCardProps {
  venue: Venue;
}

export const VenueCard = ({ venue }: VenueCardProps) => {
  const [courts, setCourts] = useState<any[]>([]);
  const [sportTypes, setSportTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCourt, setShowAddCourt] = React.useState(false);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const court = await getCourtAction({ venue_id: venue.id });
        console.log(court);

        if (!court) {
          return;
        }
        setCourts(court);

        const sportTypes = await getSportType();
        console.log(sportTypes);
        setSportTypes(sportTypes ?? []);
      } catch (error) {
        console.error("Error fetching courts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourts();
  }, [venue.id]);

  // Add this handler
  const handleAddCourt = async (formData: any) => {
    console.log(formData);
    await addCourtAction(formData);

    // Optionally refresh the courts list or add the new court to the state
    window.location.reload();
    setCourts((prevCourts) => [...prevCourts, formData]);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{venue.name}</CardTitle>
          <p className="text-sm text-gray-500">{venue.address}</p>
        </div>
        <Button variant="outline" onClick={() => setShowAddCourt(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Court
        </Button>
      </CardHeader>

      <div>
        <AddCourtDialog
          open={showAddCourt}
          onClose={() => setShowAddCourt(false)}
          onSubmit={handleAddCourt}
          venueId={venue.id}
          sportTypes={sportTypes}
        />
      </div>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading courts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courts.length === 0 ? (
              <p className="text-gray-500">No courts yet for this venue</p>
            ) : (
              courts.map((court, index) => (
                <CourtCard key={court.id || `court-${index}`} court={court} />
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
