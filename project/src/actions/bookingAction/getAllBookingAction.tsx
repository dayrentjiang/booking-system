import { supabase } from "@/lib/supabaseClient";

//get all bookings from the database based on the court id
export async function getAllBookingAction(court_id: string) {
  try {
    console.log("Getting all bookings");
    const { data, error } = await supabase
      .from("booking")
      .select("*")
      .eq("court_id", court_id);

    if (error) throw error;
    if (!data) throw new Error("Failed to get bookings: No data returned");
    console.log("got all bookings");

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
