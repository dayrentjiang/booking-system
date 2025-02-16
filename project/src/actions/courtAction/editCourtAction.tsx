import { supabase } from "@/lib/supabaseClient";

export async function editCourtAction(props: {
  courtId: string;
  name: string;
  pricing: {
    id: string;
    start_time: string;
    end_time: string;
    rate: string;
    day_type: string;
  }[];
}) {
  const { courtId, name, pricing } = props;

  try {
    // Step 1: Update the court name
    const { error: courtUpdateError } = await supabase
      .from("court")
      .update({ name })
      .eq("id", courtId);

    if (courtUpdateError) throw courtUpdateError;
    console.log("Court name updated");

    // Step 2: Fetch existing pricing for the court
    const { data: existingPricing, error: fetchPricingError } = await supabase
      .from("court_pricing")
      .select("*")
      .eq("court_id", courtId);

    if (fetchPricingError) throw fetchPricingError;

    // Step 3: Identify pricing entries to insert, update, or delete
    const pricingToInsert = pricing.filter((p) => p.id.startsWith("temp-")); // New entries
    const pricingToUpdate = pricing.filter((p) => !p.id.startsWith("temp-")); // Existing entries
    const pricingToDelete = existingPricing.filter(
      (existing) => !pricing.some((p) => p.id === existing.id)
    ); // Entries to delete

    // Step 4: Insert new pricing entries
    for (const price of pricingToInsert) {
      const { error: insertError } = await supabase
        .from("court_pricing")
        .insert({
          day_type: price.day_type,
          court_id: courtId,
          start_time: price.start_time,
          end_time: price.end_time,
          rate: price.rate
        });

      if (insertError) throw insertError;
      console.log("New pricing inserted:", price);
    }

    // Step 5: Update existing pricing entries
    for (const price of pricingToUpdate) {
      const { error: updateError } = await supabase
        .from("court_pricing")
        .update({
          day_type: price.day_type,
          start_time: price.start_time,
          end_time: price.end_time,
          rate: price.rate
        })
        .eq("id", price.id);

      if (updateError) throw updateError;
      console.log("Pricing updated:", price);
    }

    // Step 6: Delete removed pricing entries
    for (const price of pricingToDelete) {
      const { error: deleteError } = await supabase
        .from("court_pricing")
        .delete()
        .eq("id", price.id);

      if (deleteError) throw deleteError;
      console.log("Pricing deleted:", price);
    }

    console.log("All pricing updates completed successfully");
  } catch (error) {
    console.error("Error updating court and pricing:", error);
  }
}
