export interface User {
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
  id: string;
  email: string;
  name: string;
  phone: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Court {
  id: string;
  venue_id: string;
  sport_type_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface court_pricing {
  id: string;
  court_id: string;
  //enum
  day_type: ["weekday", "weekend", "holiday"];
  rate: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface sport_type {
  id: string;
  name: string;
}

export interface time_slot {
  id: string;
  start_time: string;
  end_time: string;
  rate: string;
}
