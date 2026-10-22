import React from "react";
import PatientForm from "@/components/dashboard/PatientForm";
import { getPatientById } from "@/services/patient";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getDoctors } from "@/services/doctor";

export const dynamic = "force-dynamic";

export default async function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    let patient;
    try {
        patient = await getPatientById(id);
    } catch {
        notFound();
    }

    let doctorsList: any[] = [];
    if (user.role === "admin") {
        doctorsList = await getDoctors();
    } else if (user.role === "doctor") {
        // If doctor is editing, we should probably just include their own info to avoid an empty dropdown breaking constraints
        doctorsList = [{ id: user.id, name: user.name }];
    }

    return (
        <div className="max-w-6xl mx-auto py-8">
            <PatientForm initialData={patient} patientId={id} currentUserRole={user.role} doctorsList={doctorsList} />
        </div>
    );
}
