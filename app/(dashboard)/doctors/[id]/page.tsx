import React from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserById } from "@/services/user";
import { getPatientsByDoctorId } from "@/services/patient";
import { redirect, notFound } from "next/navigation";
import DoctorProfile from "@/components/dashboard/DoctorProfile";

export const dynamic = "force-dynamic";

export default async function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
        redirect("/login");
    }

    // Only allow admins or the specific doctor themselves to view this profile
    if (currentUser.role !== "admin" && currentUser.id !== id) {
        redirect("/patients");
    }

    let doctor;
    let assignedPatients: any[] = [];

    try {
        doctor = await getUserById(id);
        
        // Ensure the ID actually belongs to a doctor, not an admin or patient (if patients were in users table)
        if (doctor.role !== "doctor") {
            notFound();
        }

        assignedPatients = await getPatientsByDoctorId(id);
    } catch (error) {
        notFound();
    }

    return <DoctorProfile doctor={doctor} assignedPatients={assignedPatients} />;
}
