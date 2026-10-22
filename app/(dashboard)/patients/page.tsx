import React from "react";
import PatientList from "@/components/dashboard/PatientList";
import { getPatientsWithDiagnostics } from "@/services/patient";
import { getCurrentUser } from "@/lib/auth/session";
import Link from "next/link";
import { Plus } from "lucide-react";

// Revalidate this page dynamically so we see new patients immediately
export const dynamic = "force-dynamic";

export default async function PatientsPage() {
    const patients = await getPatientsWithDiagnostics();
    const user = await getCurrentUser();
    const userRole = user?.role || "doctor"; // Default to doctor if missing

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Patient Directory</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm">Manage and monitor multimodal screening profiles.</p>
                </div>
                
                <Link 
                    href="/patients/new" 
                    className="inline-flex items-center gap-2 bg-[#00684A] hover:bg-[#00543B] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-sm"
                >
                    <Plus size={18} />
                    Create New Patient
                </Link>
            </div>
            
            <PatientList patients={patients as any} userRole={userRole} />
        </div>
    );
}
