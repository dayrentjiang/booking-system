export interface BookingFormData {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  venueId: string;
  courtId: string;
  date: Date | null;
  isRecurring: boolean;
  recurringEndDate: Date | null;
  timeSlots: string[];
  estimatedPrice: number;
}

export interface BookingData {
  customer_id: string;
  court_id: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  is_recurring: boolean;
  recurring_end_date: Date | null;
}
