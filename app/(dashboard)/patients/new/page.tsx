import React from "react";
import PatientForm from "@/components/dashboard/PatientForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { getDoctors } from "@/services/doctor";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewPatientPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    // Only admins can access the registration page
    if (user.role !== "admin") {
        redirect("/patients");
    }

    let doctorsList: any[] = [];
    if (user.role === "admin") {
        doctorsList = await getDoctors();
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <div className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                    <Link href="/patients" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                        Patients
                    </Link>
                    <ChevronRight size={14} className="mx-1" />
                    <span className="text-[#00684A] dark:text-emerald-500">Create New Profile</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Registration</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Initialize a new clinical or staff record for the Oncology Center.</p>
            </div>

            <PatientForm currentUserRole={user.role} doctorsList={doctorsList} />
        </div>
    );
}
