import { supabase } from "@/lib/supabaseClient";

export async function getTimeSlot() {
  try {
    let { data, error } = await supabase.from("time_slot").select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching time slot:", error);
    return null;
  }
}
