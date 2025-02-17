import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getCourtAction } from "@/services/court/getCourtAction";
import { addCourtAction } from "@/app/actions/court/addCourtAction";
import { getSportType } from "@/services/sportType/getSportType";
import CourtCard from "@/components/courts/CourtCard";
import React from "react";
import AddCourtDialog from "@/components/courts/AddCourtDialog";
import { Venue, Court } from "@/lib/types";

interface VenueCardProps {
  venue: Venue;
}

interface GroupedCourts {
  [key: string]: {
    sportName: string;
    courts: Court[];
  };
}

export const VenueCard = ({ venue }: VenueCardProps) => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [sportTypes, setSportTypes] = useState<any[]>([]);
  const [groupedCourts, setGroupedCourts] = useState<GroupedCourts>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCourt, setShowAddCourt] = React.useState(false);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const court = await getCourtAction({ venue_id: venue.id });
        const sportTypes = await getSportType();

        if (court && sportTypes) {
          setCourts(court);
          setSportTypes(sportTypes);

          // Group courts by sport type
          const grouped = court.reduce((acc: GroupedCourts, court: Court) => {
            const sport = sportTypes.find(
              (s: any) => s.id === court.sport_type_id
            );
            const sportId = court.sport_type_id.toString();

            if (!acc[sportId]) {
              acc[sportId] = {
                sportName: sport ? sport.name : "Unknown Sport",
                courts: []
              };
            }

            acc[sportId].courts.push(court);
            return acc;
          }, {});

          setGroupedCourts(grouped);
        }
      } catch (error) {
        console.error("Error fetching courts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourts();
  }, [venue.id]);

  const handleAddCourt = async (formData: any) => {
    console.log(formData);
    await addCourtAction(formData);
    window.location.reload();
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
        ) : courts.length === 0 ? (
          <p className="text-gray-500">No courts yet for this venue</p>
        ) : (
          Object.entries(groupedCourts).map(
            ([sportId, { sportName, courts }]) => (
              <div key={sportId} className="mb-8">
                <h3 className="text-lg font-semibold mb-4">{sportName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courts.map((court, index) => (
                    <CourtCard
                      key={court.id || `court-${index}`}
                      court={court}
                    />
                  ))}
                </div>
              </div>
            )
          )
        )}
      </CardContent>
    </Card>
  );
};
