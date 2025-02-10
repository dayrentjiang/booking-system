import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Venue, Court } from "@/types/types";
import { getSportType } from "@/actions/courtAction/getSportType";

// Court Card Component
const CourtCard = ({ court }: { court: Court }) => {
  const [showPricing, setShowPricing] = useState(false);
  const [sportTypeName, setSportTypeName] = useState("");

  const fetchSportType = async () => {
    try {
      const sportType = await getSportType();
      if (sportType) {
        sportType.forEach((sport: any) => {
          //   console.log(sport);
          if (sport.id === court.sport_type_id) {
            setSportTypeName(sport.name);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching sport type:", error);
    }
  };
  useEffect(() => {
    //extract the sport type using getSportTypeAction
    fetchSportType();
  }, []);

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{court.name}</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-600">
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">Sport: {sportTypeName}</p>
        <Button
          variant="outline"
          className="w-full text-sm"
          onClick={() => setShowPricing(!showPricing)}
        >
          {showPricing ? "Hide Pricing" : "View Pricing"}
        </Button>

        {showPricing && (
          <div className="mt-3 space-y-2">
            <div className="text-sm font-medium">Weekday Rates:</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Morning</div>
                <div>$30/hr</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Afternoon</div>
                <div>$40/hr</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Night</div>
                <div>$50/hr</div>
              </div>
            </div>

            <div className="text-sm font-medium">Weekend Rates:</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Morning</div>
                <div>$40/hr</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Afternoon</div>
                <div>$50/hr</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Night</div>
                <div>$60/hr</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourtCard;
