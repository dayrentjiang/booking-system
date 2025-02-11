import { supabase } from "@/lib/supabaseClient";

export async function editCourtAction(props: {
  courtId: string;
  name: string;
  pricing: {
    id: string;
    start_time: string;
    end_time: string;
    rate: string;
  }[];
}) {
  const { courtId, pricing } = props;
  //update the court name first before updating the pricing
  try {
    const { data, error } = await supabase
      .from("court")
      .update({ name: props.name })
      .eq("id", courtId);
    if (error) throw error;
    console.log("Court name updated");
  } catch (error) {
    console.error(error);
  }

  //update the court_pricing based on the pricing array, there might be a new
  try {
    pricing.forEach(async (price) => {
      const { data, error } = await supabase
        .from("court_pricing")
        .update({
          rate: price.rate,
          start_time: price.start_time,
          end_time: price.end_time
        })
        .eq("id", price.id);
      if (error) throw error;
      console.log("Court pricing updated");

      return data;
    });
  } catch (error) {
    console.error(error);
  }
}

//there is also a new court pricing or some court pricing is removed
