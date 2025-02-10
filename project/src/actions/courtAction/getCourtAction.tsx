import { supabase } from "@/lib/supabaseClient";

//get court base on the venue id
export async function getCourtAction(props: { venue_id: string }) {
  const { venue_id } = props;
  try {
    let { data, error } = await supabase
      .from("court")
      .select("*")
      .eq("venue_id", venue_id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching court:", error);
    return null;
  }
}
