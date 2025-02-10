import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Venue, Court } from "@/types/types";
import { getSportType } from "@/actions/courtAction/getSportType";
import { deleteCourtAction } from "@/actions/courtAction/deleteCourtAction";
import { getCourtPricing } from "@/actions/courtAction/getCourtPricing";
import { updateCourtStatusAction } from "@/actions/courtAction/updateCourtStatusAction";

// Court Card Component
const CourtCard = ({ court }: { court: Court }) => {
  const [sportTypeName, setSportTypeName] = useState("");
  const [courtPricing, setCourtPricing] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(court.is_active || false);

  const fetchSportType = async () => {
    try {
      const sportType = await getSportType();
      if (sportType) {
        const sport = sportType.find((s: any) => s.id === court.sport_type_id);
        if (sport) {
          setSportTypeName(sport.name);
        }
      }
    } catch (error) {
      console.error("Error fetching sport type:", error);
    }
  };

  const fetchCourtPricing = async () => {
    try {
      const pricing = await getCourtPricing({ court_id: court.id });
      if (pricing) {
        setCourtPricing(pricing);
      }
    } catch (error) {
      console.error("Error fetching court pricing:", error);
    }
  };

  useEffect(() => {
    fetchCourtPricing();
    fetchSportType();
  }, []);

  const handleActivationToggle = async () => {
    try {
      // Call backend to update court status
      await updateCourtStatusAction({
        courtId: court.id,
        status: !isActive
      });
      // Update local state
      setIsActive(!isActive);
    } catch (error) {
      console.error("Error updating court status:", error);
    }
  };

  // Separate pricing by day type
  const weekdayPricing = courtPricing.filter((p) => p.day_type === "weekday");
  const weekendPricing = courtPricing.filter((p) => p.day_type === "weekend");

  const formatTime = (time: string) => {
    // If time is already in HH:mm format, return it
    if (/^\d{2}:\d{2}$/.test(time)) return time;

    // If time includes seconds, remove them
    const formattedTime = time.split(":").slice(0, 2).join(":");

    return formattedTime;
  };

  return (
    <Card
      className={`
      bg-white 
      ${
        isActive
          ? "border-green-500 border-opacity-50"
          : "border-red-500 border-opacity-50"
      }
    `}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold">{court.name}</h3>
            <div
              className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${
                  isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              `}
            >
              {isActive ? "Active" : "Inactive"}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleActivationToggle}
              className={isActive ? "text-green-600" : "text-red-600"}
            >
              {isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </Button>
            <Button variant="ghost" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600"
              onClick={() => {
                // Add delete court action confirmation dialog
                // deleteCourtAction({ courtId: court.id });
              }}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">Sport: {sportTypeName}</p>

        {/* Separator */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Pricing Section */}
        <div className={`space-y-4 ${!isActive ? "opacity-50" : ""}`}>
          {/* Weekday Pricing */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-700">
              Weekday Rates
            </h4>
            <div className="space-y-2">
              {weekdayPricing.map((pricing, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <div className="flex-grow">
                    <span className="font-medium text-sm">
                      {/* format the time to 24-hour format without the second */}
                      {formatTime(pricing.start_time)} -{" "}
                      {formatTime(pricing.end_time)}
                    </span>
                  </div>
                  <div className="text-sm font-semibold">
                    {pricing.rate ? `${pricing.rate}/hour` : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekend Pricing */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-700">
              Weekend Rates
            </h4>
            <div className="space-y-2">
              {weekendPricing.map((pricing, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <div className="flex-grow">
                    <span className="font-medium text-sm">
                      {formatTime(pricing.start_time)} -{" "}
                      {formatTime(pricing.end_time)}
                    </span>
                  </div>
                  <div className="text-sm font-semibold">
                    {pricing.rate ? `${pricing.rate}/hour` : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourtCard;
