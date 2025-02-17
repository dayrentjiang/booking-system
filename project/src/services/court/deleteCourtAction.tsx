import { supabase } from "@/lib/supabaseClient";

export async function deleteCourtAction(props: { courtId: string }) {
  const { courtId } = props;
  try {
    const { data, error } = await supabase
      .from("court")
      .delete()
      .eq("id", courtId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
  }
}
