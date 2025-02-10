import { supabase } from "@/lib/supabaseClient";

export async function addVenueAction(props: {
  ownerId: string;
  name: string;
  address: string;
}) {
  const { ownerId, name, address } = props;
  try {
    console.log("Adding court");
    const { data, error } = await supabase.from("venue").insert([
      {
        owner_id: ownerId,
        name: name,
        address: address
      }
    ]);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}
