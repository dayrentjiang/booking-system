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

interface VenueFormData {
  owner_id: string;
  name: string;
  address: string;
}

interface AddVenueDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; address: string }) => Promise<void>;
}

export const AddVenueDialog = ({
  open,
  onClose,
  onSubmit
}: AddVenueDialogProps) => {
  const [formData, setFormData] = React.useState({
    name: "",
    address: ""
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: formData.name,
        address: formData.address
      });

      // Reset form
      setFormData({ name: "", address: "" });
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Venue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Venue Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter venue name"
              required
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Enter venue address"
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding..." : "Add Venue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
