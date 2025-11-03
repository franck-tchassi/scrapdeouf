//(protedid)/dashboard/layout.tsx

import { DashboardLayout } from "./dashboard-layout";
import { getCurrentUser } from "@/actions/getCurrentUser"; // Import server action
import { SafeUser } from "@/types"; // Import SafeUser type
import { redirect } from "next/navigation";

export default async function Layout({ // Make it async to fetch data
    children,
}: {
    children: React.ReactNode;
}) {
    const currentUser: SafeUser | null = await getCurrentUser(); 

    // Redirection côté serveur
    if (!currentUser) {
        redirect("/login");
    }
    return <DashboardLayout currentUser={currentUser}>{children}</DashboardLayout>;
}



