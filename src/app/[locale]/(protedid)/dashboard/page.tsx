// app/dashboard/page.tsx
import DashboardOverview from "./dashboard-overview/page";
import { getCurrentUser } from "@/actions/getCurrentUser";

export default async function DashboardPage() {
    const currentUser = await getCurrentUser();
    
    return <DashboardOverview currentUser={currentUser} />;
}