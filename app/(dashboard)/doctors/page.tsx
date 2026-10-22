import React from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { getDoctors } from "@/services/doctor";
import { redirect } from "next/navigation";
import DoctorDirectory from "@/components/dashboard/DoctorDirectory";

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
    const user = await getCurrentUser();
    
    if (!user) {
        redirect("/login");
    }

    // Only allow admins to view the medical staff directory
    if (user.role !== "admin") {
        redirect("/patients");
    }

    const doctors = await getDoctors();

    return <DoctorDirectory doctors={doctors} />;
}
