// components/CustomerSelection.tsx
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Customer, DUMMY_CUSTOMERS } from "@/types/dummy";

interface CustomerSelectionProps {
  selectedCustomer: string;
  onCustomerSelect: (customerId: string) => void;
  onNewCustomerAdd: (
    customer: Omit<Customer, "id" | "created_at" | "updated_at">
  ) => void;
}

export const CustomerSelection: React.FC<CustomerSelectionProps> = ({
  selectedCustomer,
  onCustomerSelect,
  onNewCustomerAdd
}) => {
  const [customerSearch, setCustomerSearch] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const filteredCustomers = DUMMY_CUSTOMERS.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.phone.includes(customerSearch)
  );

  const handleAddNewCustomer = () => {
    onNewCustomerAdd(newCustomer);
    setNewCustomer({ name: "", email: "", phone: "" });
  };

  return (
    <Card className="p-4">
      <Label className="mb-3 block">Select or Add Customer</Label>
      <div className="space-y-4">
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Search existing customer by name, email, or phone"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
          />
          <Select value={selectedCustomer} onValueChange={onCustomerSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">+ Add New Customer</SelectItem>
              {filteredCustomers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCustomer === "new" && (
          <div className="space-y-3 pt-3 border-t">
            <Input
              placeholder="Customer Name"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
            />
            <Input
              type="email"
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
            />
            <Input
              placeholder="Phone"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
            />
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  onCustomerSelect("");
                  setNewCustomer({ name: "", email: "", phone: "" });
                }}
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                onClick={handleAddNewCustomer}
                disabled={
                  !newCustomer.name || !newCustomer.email || !newCustomer.phone
                }
              >
                Add Customer
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
