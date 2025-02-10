import { supabase } from "@/lib/supabaseClient";

//get the courtPricing by court id
export async function getCourtPricing(props: { court_id: string }) {
  const { court_id } = props;
  try {
    let { data, error } = await supabase
      .from("court_pricing")
      .select("*")
      .eq("court_id", court_id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching court pricing:", error);
    return null;
  }
}
