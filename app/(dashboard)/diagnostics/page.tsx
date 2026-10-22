import React from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { getPatients, getPatientsByDoctorId } from "@/services/patient";
import { redirect } from "next/navigation";
import NewScreeningForm from "@/components/dashboard/NewScreeningForm";

export const dynamic = "force-dynamic";

export default async function DiagnosticsPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const user = await getCurrentUser();
    
    if (!user) {
        redirect("/login");
    }

    if (user.role !== "doctor") {
        redirect("/patients");
    }

    const patients = await getPatientsByDoctorId(user.id);
    const resolvedParams = await searchParams;
    const initialPatientId = typeof resolvedParams.patientId === 'string' ? resolvedParams.patientId : undefined;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <NewScreeningForm patients={patients} initialPatientId={initialPatientId} />
        </div>
    );
}
