import { supabase } from "@/lib/supabaseClient";

//get all venues with their court own by the owner create object like this
// {
//     id: "v1",
//     name: "Downtown Sports Center",
//     courts: [
//       { id: "c1", name: "Court A" },
//       { id: "c2", name: "Court B" },
//       { id: "c3", name: "Court C" }
//     ]
//   },
//   {
//     id: "v2",
//     name: "Westside Tennis Club",
//     courts: [
//       { id: "c4", name: "Center Court" },
//       { id: "c5", name: "Practice Court 1" },
//       { id: "c6", name: "Practice Court 2" }
//     ]
// }
export async function getVenuesWithCourt(owner_id: string) {
  try {
    // First fetch venues
    const { data: venues, error: venueError } = await supabase
      .from("venue")
      .select("id, name")
      .eq("owner_id", owner_id);

    if (venueError) throw venueError;
    if (!venues) throw new Error("Failed to get venues: No data returned");

    // Then fetch courts for each venue and structure the data
    const venuesWithCourts = await Promise.all(
      venues.map(async (venue) => {
        const { data: courts, error: courtError } = await supabase
          .from("court")
          .select("id, name")
          .eq("venue_id", venue.id);

        if (courtError) throw courtError;
        if (!courts) throw new Error("Failed to get courts: No data returned");

        // Return structured data for each venue with its courts
        return {
          id: venue.id,
          name: venue.name,
          courts: courts.map((court) => ({
            id: court.id,
            name: court.name
          }))
        };
      })
    );

    console.log("Venues with courts:", venuesWithCourts);

    return venuesWithCourts;
  } catch (error) {
    throw error;
  }
}
