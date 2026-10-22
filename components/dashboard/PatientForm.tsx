"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createPatient, updatePatient } from "@/services/patient";
import { createDoctor } from "@/services/doctor";
import { User, Activity, Lock, Mail, Calendar, Hash, Phone } from "lucide-react";

export default function PatientForm({ 
    initialData, 
    patientId,
    currentUserRole = "admin",
    doctorsList = []
}: { 
    initialData?: any, 
    patientId?: string,
    currentUserRole?: string,
    doctorsList?: any[]
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    
    // Determine mode: "patient" or "doctor"
    const [mode, setMode] = useState<"patient" | "doctor">(currentUserRole === "doctor" ? "doctor" : "patient");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);

        try {
            if (mode === "patient") {
                const dobString = formData.get("dateOfBirth") as string;
                const data = {
                    firstName: formData.get("firstName") as string,
                    lastName: formData.get("lastName") as string,
                    dateOfBirth: dobString ? new Date(dobString) : undefined,
                    gender: formData.get("gender") as "female" | "male" | "other",
                    contactNumber: formData.get("contactNumber") as string,
                    email: formData.get("email") as string,
                    address: formData.get("address") as string,
                    medicalHistory: formData.get("medicalHistory") as string,
                    assignedDoctorId: formData.get("assignedDoctorId") as string,
                };
                
                if (patientId) {
                    await updatePatient(patientId, data);
                } else {
                    await createPatient(data);
                }
                router.push("/patients");
            } else if (mode === "doctor") {
                const data = {
                    name: formData.get("fullName") as string,
                    email: formData.get("email") as string,
                    password: formData.get("password") as string,
                };
                await createDoctor(data);
                router.push("/patients"); // or /doctors if that route exists
            }
        } catch (err: any) {
            setError(err.message || "Failed to save profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            {!patientId && currentUserRole !== "doctor" && (
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-lg inline-flex shadow-inner">
                        <button
                            type="button"
                            onClick={() => setMode("patient")}
                            className={`px-6 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                                mode === "patient" 
                                    ? "bg-white dark:bg-slate-700 text-[#00684A] dark:text-emerald-400 shadow-sm" 
                                    : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                            }`}
                        >
                            Patient Registration
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("doctor")}
                            className={`px-6 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                                mode === "doctor" 
                                    ? "bg-white dark:bg-slate-700 text-[#00684A] dark:text-emerald-400 shadow-sm" 
                                    : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                            }`}
                        >
                            Doctor Registration
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium flex items-center gap-2 shadow-sm">
                    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {mode === "patient" && (
                    <>
                        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-emerald-50 dark:border-slate-700 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#00684A]"></div>
                            
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-[#00684A] dark:text-emerald-400">
                                    <User size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Patient Demographics</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-slate-200 mb-1.5">Full Legal Name *</label>
                                        <div className="flex gap-3">
                                            <input 
                                                name="firstName" 
                                                type="text" 
                                                required 
                                                defaultValue={initialData?.firstName || ""}
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#00684A] text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none"
                                                placeholder="First name"
                                            />
                                            <input 
                                                name="lastName" 
                                                type="text" 
                                                required 
                                                defaultValue={initialData?.lastName || ""}
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#00684A] text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none"
                                                placeholder="Last name"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-slate-200 mb-1.5 flex items-center gap-1">Patient ID <span className="text-gray-400 font-normal">(Auto-generated)</span></label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Hash size={16} className="text-gray-400" />
                                            </div>
                                            <input 
                                                type="text" 
                                                disabled
                                                defaultValue="OV-2024-XXXX-X"
                                                className="w-full pl-10 pr-4 py-2.5 bg-blue-50/50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 rounded-lg text-gray-500 dark:text-slate-400 font-medium cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-slate-200 mb-1.5">Date of Birth</label>
                                        <div className="relative">
                                            <input 
                                                name="dateOfBirth" 
                                                type="date" 
                                                defaultValue={initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : ""}
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#00684A] text-gray-900 dark:text-white transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-slate-200 mb-2.5">Biological Sex *</label>
                                        <div className="flex items-center gap-6 pt-1.5">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input type="radio" name="gender" value="female" defaultChecked={!initialData || initialData.gender === 'female'} className="w-4 h-4 text-[#00684A] border-gray-300 focus:ring-[#00684A]" />
                                                <span className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white">Female</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input type="radio" name="gender" value="male" defaultChecked={initialData?.gender === 'male'} className="w-4 h-4 text-[#00684A] border-gray-300 focus:ring-[#00684A]" />
                                                <span className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white">Male</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input type="radio" name="gender" value="other" defaultChecked={initialData?.gender === 'other'} className="w-4 h-4 text-[#00684A] border-gray-300 focus:ring-[#00684A]" />
                                                <span className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white">Other</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-slate-200 mb-1.5">Contact Information (Email/Phone)</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Mail size={16} className="text-gray-400" />
                                            </div>
                                            <input 
                                                name="email" 
                                                type="email" 
                                                defaultValue={initialData?.email || ""}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#00684A] text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Phone size={16} className="text-gray-400" />
                                            </div>
                                            <input 
                                                name="contactNumber" 
                                                type="tel" 
                                                defaultValue={initialData?.contactNumber || ""}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#00684A] text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-slate-200 mb-1.5">Physical Address</label>
                                        <input 
                                            name="address" 
                                            type="text" 
                                            defaultValue={initialData?.address || ""}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#00684A] text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none"
                                            placeholder="123 Health St, City, Country"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-slate-200 mb-1.5">Assigned Doctor *</label>
                                        <select 
                                            name="assignedDoctorId" 
                                            required
                                            disabled={currentUserRole === "doctor"}
                                            defaultValue={initialData?.assignedDoctorId || ""}
                                            className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#00684A] text-gray-900 dark:text-white transition-all outline-none ${currentUserRole === "doctor" ? "opacity-75 cursor-not-allowed bg-gray-50 dark:bg-slate-800" : ""}`}
                                        >
                                            <option value="" disabled>Select an Oncologist</option>
                                            {doctorsList.map((doc) => (
                                                <option key={doc.id} value={doc.id}>Dr. {doc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Activity size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Clinical History</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-slate-200 mb-2">Previous Screenings & Procedures</label>
                                <textarea 
                                    name="medicalHistory" 
                                    rows={5}
                                    defaultValue={initialData?.medicalHistory || ""}
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none resize-y"
                                    placeholder="Describe previous mammograms, biopsies, or relevant imaging history..."
                                ></textarea>
                            </div>
                        </div>
                    </>
                )}

                {mode === "doctor" && (
                    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-blue-50 dark:border-slate-700 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#00684A]"></div>
                        
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#00684A] dark:text-emerald-400">
                                <User size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Doctor Demographics</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-slate-200 mb-1.5">Full Legal Name *</label>
                                    <input 
                                        name="fullName" 
                                        type="text" 
                                        required 
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#00684A] text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none"
                                        placeholder="Dr. Jane Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-slate-200 mb-1.5 flex items-center gap-1">Doctor ID <span className="text-gray-400 font-normal">(Auto-generated)</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Hash size={16} className="text-gray-400" />
                                        </div>
                                        <input 
                                            type="text" 
                                            disabled
                                            defaultValue="MD-2024-XXXX-X"
                                            className="w-full pl-10 pr-4 py-2.5 bg-blue-50/50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 rounded-lg text-gray-500 dark:text-slate-400 font-medium cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-slate-200 mb-1.5">Email Address *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Mail size={16} className="text-gray-400" />
                                        </div>
                                        <input 
                                            name="email" 
                                            type="email" 
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#00684A] text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none"
                                            placeholder="doctor@hospital.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-slate-200 mb-1.5">Password *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Lock size={16} className="text-gray-400" />
                                        </div>
                                        <input 
                                            name="password" 
                                            type="password" 
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#00684A] text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-6">
                    <button 
                        type="button" 
                        onClick={() => router.back()}
                        className="px-6 py-2.5 text-sm font-bold text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-8 py-2.5 text-sm font-bold text-white bg-[#00684A] rounded-lg hover:bg-[#00543B] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00684A] disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isLoading ? "Saving..." : `Save ${mode === 'patient' ? 'Patient' : 'Doctor'}`}
                    </button>
                </div>
            </form>
        </div>
    );
}
