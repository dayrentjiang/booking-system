import { supabase } from "@/lib/supabaseClient";
import { BookingFormData } from "@/types/interface";

//formdata interface
interface FormData {
  venue_id: string;
  sport_type_id: string;
  name: string;
  pricing: {
    weekday: [
      {
        day_type: string;
        rate: number;
        start_time: string;
        end_time: string;
      }
    ];
    weekend: [
      {
        day_type: string;
        rate: number;
        start_time: string;
        end_time: string;
      }
    ];
  };
}

//add court accepts a formdata object with venue_id, sport_type_id, and name then get the court id and insert court_pricing (an array)
export async function addCourtAction(formData: FormData) {
  try {
    console.log("Adding court");
    const venue_id = formData.venue_id;
    const sport_type_id = formData.sport_type_id;
    const name = formData.name;

    // Get court_pricing from FormData and parse it
    const dayPricing = formData.pricing;
    //the pricing have weekend and weekday pricing, destructure it from the first element
    const { weekday, weekend } = dayPricing;

    console.log(venue_id, sport_type_id, name, weekday, weekend);

    const { data, error } = await supabase
      .from("court")
      .insert([
        {
          venue_id,
          sport_type_id,
          name
        }
      ])
      .select();

    if (error) throw error;
    if (!data) throw new Error("Failed to create court: No data returned");

    const court_id = data[0].id;
    console.log("Adding court pricing");

    //add for weekday pricing
    await supabase.from("court_pricing").insert(
      weekday.map(
        (pricing: {
          // day_type: string;
          rate: number;
          start_time: string;
          end_time: string;
        }) => ({
          day_type: "weekday",
          court_id: court_id,
          start_time: pricing.start_time,
          end_time: pricing.end_time,
          rate: pricing.rate
        })
      )
    );

    //add for weekend pricing
    await supabase.from("court_pricing").insert(
      weekend.map(
        (pricing: {
          // day_type: string;
          rate: number;
          start_time: string;
          end_time: string;
        }) => ({
          day_type: "weekend",
          court_id: court_id,
          start_time: pricing.start_time,
          end_time: pricing.end_time,
          rate: pricing.rate
        })
      )
    );

    return data;
  } catch (error) {
    console.error(error);
  }
}
