import React from "react";
import { getPatientById } from "@/services/patient";
import { getDiagnosticsForPatient } from "@/services/diagnostic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import PatientDiagnostics from "@/components/dashboard/PatientDiagnostics";
import PatientProfileHeader from "@/components/dashboard/PatientProfileHeader";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ViewPatientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getCurrentUser();
    let patient;
    let diagnostics = [];
    try {
        patient = await getPatientById(id);
        diagnostics = await getDiagnosticsForPatient(id);
    } catch (error) {
        console.error("Error fetching patient or diagnostics:", error);
        notFound();
    }

    const lastScreeningDate = diagnostics.length > 0 ? diagnostics[0].createdAt : undefined;
    // Mocking doctor name, or we could fetch it if assignedDoctorId is resolved
    const assignedDoctorName = "Sarah Chen";

    return (
        <div className="max-w-6xl mx-auto py-6 space-y-6">
            <div className="mb-2">
                <Link 
                    href="/patients"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Patient Directory
                </Link>
            </div>

            <PatientProfileHeader 
                patient={patient} 
                lastScreeningDate={lastScreeningDate} 
                assignedDoctorName={assignedDoctorName} 
                currentUserRole={user?.role}
            />
            
            <div className="mt-8">
                <PatientDiagnostics patientId={id} diagnostics={diagnostics as any} />
            </div>
        </div>
    );
}
