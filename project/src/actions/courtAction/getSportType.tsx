import { supabase } from "@/lib/supabaseClient";

export async function getSportType() {
  try {
    let { data, error } = await supabase.from("sport_type").select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching sport type:", error);
    return null;
  }
}
