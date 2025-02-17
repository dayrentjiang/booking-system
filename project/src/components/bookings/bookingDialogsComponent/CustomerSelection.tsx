import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface CustomerSelectionProps {
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
}

export const CustomerSelection: React.FC<CustomerSelectionProps> = ({
  customerInfo,
  onCustomerInfoChange
}) => {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Customer name"
            value={customerInfo.name}
            onChange={(e) =>
              onCustomerInfoChange({
                ...customerInfo,
                name: e.target.value
              })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            value={customerInfo.email}
            onChange={(e) =>
              onCustomerInfoChange({
                ...customerInfo,
                email: e.target.value
              })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="Phone number"
            value={customerInfo.phone}
            onChange={(e) =>
              onCustomerInfoChange({
                ...customerInfo,
                phone: e.target.value
              })
            }
            required
          />
        </div>
      </div>
    </Card>
  );
};

export default CustomerSelection;
