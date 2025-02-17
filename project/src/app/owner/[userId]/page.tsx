import { DashboardOverview } from "@/components/DashboardOverview";
import { auth } from "@clerk/nextjs/server";
import { getOwnerAction } from "@/services/owner/getOwnerAction";
import { useState } from "react";

export default async function OwnerDashboard() {
  const { userId } = await auth();

  console.log(userId);
  if (userId) {
    const ownerResponse = await getOwnerAction({ userId });
    console.log(ownerResponse);
    return <DashboardOverview user={ownerResponse} />;
  } else {
    console.error("User ID is null");
  }
}
