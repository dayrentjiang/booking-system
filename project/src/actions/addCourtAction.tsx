import { supabase } from "@/lib/supabaseClient";

export async function addCourtAction() {
  try {
    console.log("Adding court");
    const { data, error } = await supabase.from("courts").insert([
      {
        venue_id: "0bee4cfc-a8dc-4f2f-a6af-715dc40e3eb4",
        sport_type_id: "61786d96-8525-49c3-a10b-a425ea73a35b",
        name: "Lapangan basket 1"
      }
    ]);
  } catch (error) {
    console.error(error);
  }
}
