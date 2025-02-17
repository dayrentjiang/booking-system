import { supabase } from "@/lib/supabaseClient";

export async function addCourtPricing(props: {
  day_type: string;
  rate: number;
  court_id: string;
  time_slot_id: string;
}) {
  const { court_id, time_slot_id, rate, day_type } = props;
  try {
    console.log("Adding court pricing");
    const { data, error } = await supabase.from("court_pricing").insert([
      {
        day_type: day_type,
        court_id: court_id,
        time_slot_id: time_slot_id,
        rate: rate
      }
    ]);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}
