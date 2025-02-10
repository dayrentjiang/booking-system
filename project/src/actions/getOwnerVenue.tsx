import { supabase } from "@/lib/supabaseClient";

export async function getOwnerVenue(props: { userId: string }) {
  const { userId } = props;
  try {
    let { data, error } = await supabase
      .from("venue")
      .select("*")
      .eq("owner_id", userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching owner:", error);
    return null;
  }
}
