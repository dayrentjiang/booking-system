// types.ts
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
}

export interface CourtPricing {
  id: string;
  court_id: string;
  day_type: "weekday" | "weekend" | "holiday";
  rate: string;
  start_time: string;
  end_time: string;
}

export interface Booking {
  id?: string;
  customer_id: string;
  court_id: string;
  start_time: string;
  end_time: string;
  booking_status: "pending" | "confirmed" | "cancelled";
  payment_status: "pending" | "confirmed" | "refunded";
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface Venue {
  id: string;
  name: string;
  courts: { id: string; name: string }[];
}

// dummy-data.ts

export const DUMMY_COURT_PRICING: CourtPricing[] = [
  {
    id: "1",
    court_id: "80ab84bc-17c5-4a8f-a935-a6a3c3fd3a20",
    day_type: "weekday",
    rate: "50",
    start_time: "06:00",
    end_time: "18:00"
  },
  {
    id: "2",
    court_id: "80ab84bc-17c5-4a8f-a935-a6a3c3fd3a20",
    day_type: "weekday",
    rate: "80",
    start_time: "18:00",
    end_time: "23:00"
  },
  {
    id: "3",
    court_id: "80ab84bc-17c5-4a8f-a935-a6a3c3fd3a20",
    day_type: "weekend",
    rate: "100",
    start_time: "06:00",
    end_time: "23:00"
  }
];

export const DUMMY_EXISTING_BOOKINGS: Booking[] = [
  {
    id: "1",
    court_id: "80ab84bc-17c5-4a8f-a935-a6a3c3fd3a20",
    customer_id: "1",
    start_time: "2025-02-16 08:00:00",
    end_time: "2025-02-16 10:00:00",
    booking_status: "confirmed",
    payment_status: "confirmed",
    total_amount: 100
  }
];

export const TIME_SLOTS = [
  "06:00-07:00",
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
  "22:00-23:00",
  "23:00-00:00"
];
