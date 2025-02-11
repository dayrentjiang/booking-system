import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Edit,
  Trash,
  ToggleLeft,
  ToggleRight,
  Save,
  X,
  Plus,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Venue, Court } from "@/types/types";
import { getSportType } from "@/actions/courtAction/getSportType";
import { deleteCourtAction } from "@/actions/courtAction/deleteCourtAction";
import { getCourtPricing } from "@/actions/courtAction/getCourtPricing";
import { updateCourtStatusAction } from "@/actions/courtAction/updateCourtStatusAction";
import { editCourtAction } from "@/actions/courtAction/editCourtAction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import ConfirmDialog from "./ConfirmDialog";

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" }
];

const CourtCard = ({ court }: { court: Court }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [sportTypes, setSportTypes] = useState<any[]>([]);
  const [sportTypeName, setSportTypeName] = useState("");
  const [courtPricing, setCourtPricing] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(court.is_active || false);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] =
    useState(false);

  const [editData, setEditData] = useState({
    name: court.name,
    sport_type_id: String(court.sport_type_id),
    pricing: [] as any[]
  });

  const fetchSportType = async () => {
    try {
      const sportType = await getSportType();
      if (sportType) {
        setSportTypes(sportType);
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
        setEditData((prev) => ({
          ...prev,
          pricing: pricing.map((p: any) => ({
            ...p,
            start_time: formatTime(p.start_time),
            end_time: formatTime(p.end_time)
          }))
        }));
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
      await updateCourtStatusAction({
        courtId: court.id,
        status: !isActive
      });
      setIsActive(!isActive);
    } catch (error) {
      console.error("Error updating court status:", error);
    }
  };

  const handleEditSubmit = () => {
    console.log("Court Edit Data:", {
      courtId: court.id,
      ...editData
    });
    setIsEditMode(false);
    editCourtAction({
      courtId: court.id,
      ...editData
    });
  };

  const handlePricingChange = (
    pricingId: string,
    field: string,
    value: string
  ) => {
    setEditData((prev) => ({
      ...prev,
      pricing: prev.pricing.map((p) =>
        p.id === pricingId ? { ...p, [field]: value } : p
      )
    }));
  };

  const addTimeSlot = (dayType: "weekday" | "weekend") => {
    const newSlot = {
      court_id: court.id,
      day_type: dayType,
      start_time: "00:00",
      end_time: "00:00",
      rate: "",
      id: `temp-${Date.now()}`
    };

    setEditData((prev) => ({
      ...prev,
      pricing: [...prev.pricing, newSlot]
    }));
  };

  const removeTimeSlot = (pricingId: string) => {
    setEditData((prev) => ({
      ...prev,
      pricing: prev.pricing.filter((p) => p.id !== pricingId)
    }));
  };

  const formatTime = (time: string) => {
    if (/^\d{2}:\d{2}$/.test(time)) return time;
    return time.split(":").slice(0, 2).join(":");
  };

  return (
    <Card
      className={`bg-white shadow-lg rounded-lg ${
        isActive ? "border-green-500" : "border-red-500"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="flex items-center space-x-3">
            {isEditMode ? (
              <Input
                value={editData.name}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-40"
              />
            ) : (
              <h3 className="text-xl font-semibold">{court.name}</h3>
            )}
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleActivationToggle}
              className={isActive ? "text-green-600" : "text-red-600"}
            >
              {isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </Button>
            {isEditMode ? (
              <>
                <Button variant="ghost" size="icon" onClick={handleEditSubmit}>
                  <Save className="w-4 h-4 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditMode(false)}
                >
                  <X className="w-4 h-4 text-red-600" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditMode(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600"
                  onClick={() => setIsDeleteConfirmationDialogOpen(true)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
                <ConfirmDialog
                  open={isDeleteConfirmationDialogOpen}
                  onClose={() => setIsDeleteConfirmationDialogOpen(false)}
                  onConfirm={async () => {
                    await deleteCourtAction({ courtId: court.id });
                    window.location.reload();
                  }}
                  title="Confirm Deletion"
                  message="Are you sure you want to delete this Court? This action cannot be undone."
                />
              </>
            )}
          </div>
        </div>

        {isEditMode ? (
          <Select
            value={editData.sport_type_id.toString()}
            onValueChange={(value) =>
              setEditData((prev) => ({
                ...prev,
                sport_type_id: value
              }))
            }
          >
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Select sport type" />
            </SelectTrigger>
            <SelectContent>
              {sportTypes.map((sport) => (
                <SelectItem key={sport.id} value={sport.id.toString()}>
                  {sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-gray-600 mb-4">Sport: {sportTypeName}</p>
        )}

        <div className="border-t border-gray-200 my-4"></div>

        <div className={`space-y-4 ${!isActive ? "opacity-50" : ""}`}>
          {["weekday", "weekend"].map((dayType) => (
            <div key={dayType}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  {dayType === "weekday" ? "Weekday" : "Weekend"} Rates
                </h4>
                {isEditMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addTimeSlot(dayType as "weekday" | "weekend")
                    }
                    className="h-8"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Time Slot
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {editData.pricing
                  .filter((p) => p.day_type === dayType)
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((pricing) => (
                    <div
                      key={pricing.id}
                      className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-3 rounded-lg"
                    >
                      {isEditMode ? (
                        <>
                          <div className="flex space-x-2 w-full md:w-auto mb-2 md:mb-0">
                            <Input
                              value={pricing.start_time}
                              onChange={(e) =>
                                handlePricingChange(
                                  pricing.id,
                                  "start_time",
                                  e.target.value
                                )
                              }
                              className="w-24"
                              placeholder="HH:mm"
                            />
                            <span className="self-center">-</span>
                            <Input
                              value={pricing.end_time}
                              onChange={(e) =>
                                handlePricingChange(
                                  pricing.id,
                                  "end_time",
                                  e.target.value
                                )
                              }
                              className="w-24"
                              placeholder="HH:mm"
                            />
                          </div>
                          <Input
                            value={pricing.rate}
                            onChange={(e) =>
                              handlePricingChange(
                                pricing.id,
                                "rate",
                                e.target.value
                              )
                            }
                            className="w-32 mx-2"
                            placeholder="Rate"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTimeSlot(pricing.id)}
                            className="text-red-600"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex-grow">
                            <span className="font-medium text-sm">
                              {formatTime(pricing.start_time)} -{" "}
                              {formatTime(pricing.end_time)}
                            </span>
                          </div>
                          <div className="text-sm font-semibold">
                            {pricing.rate ? `${pricing.rate}/hr` : "N/A"}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourtCard;
