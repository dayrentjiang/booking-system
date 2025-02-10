import CourtsPage from "@/components/courts/CourtPage";
import { getOwnerVenue } from "@/actions/getOwnerVenue";

export default async function CourtPage({
  params
}: {
  params: { userId: string };
}) {
  const { userId } = await params;
  const venues = await getOwnerVenue({ userId });
  if (!venues) {
    console.error("No venues found");
    return;
  }
  // console.log(venues);

  //get all the courts from the venues and pass it to the courts page

  return <CourtsPage venues={venues} />;
}
