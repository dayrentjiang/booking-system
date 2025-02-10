import { supabase } from "@/lib/supabaseClient";

export async function updateCourtStatusAction(props: {
  courtId: string;
  status: boolean;
}) {
  const { courtId, status } = props;
  try {
    const { data, error } = await supabase
      .from("court")
      .update({ is_active: status })
      .eq("id", courtId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}
