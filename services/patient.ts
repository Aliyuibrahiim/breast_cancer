"use server";

import { db } from "@/lib/db";
import { patients } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
export async function getPatientsByDoctorId(doctorId: string) {
    try {
        return await db.select().from(patients).where(eq(patients.assignedDoctorId, doctorId)).orderBy(desc(patients.createdAt));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch assigned patients: ${errorMessage}`);
    }
}

export async function getPatients() {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        let query = db.select().from(patients);
        
        if (user.role === "doctor") {
            query = query.where(eq(patients.assignedDoctorId, user.id)) as any;
        }

        return await query.orderBy(desc(patients.createdAt));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch patients: ${errorMessage}`);
    }
}

export async function getPatientsWithDiagnostics() {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        const queryOptions: any = {
            orderBy: [desc(patients.createdAt)],
            with: {
                diagnostics: {
                    orderBy: (diagnostics: any, { desc }: any) => [desc(diagnostics.createdAt)],
                }
            }
        };

        if (user.role === "doctor") {
            queryOptions.where = eq(patients.assignedDoctorId, user.id);
        }

        return await db.query.patients.findMany(queryOptions);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch patients with diagnostics: ${errorMessage}`);
    }
}

export async function getPatientById(id: string) {
    try {
        const results = await db.select().from(patients).where(eq(patients.id, id));
        const patient = results[0];
        if (!patient) throw new Error("Patient not found");
        return patient;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch patient: ${errorMessage}`);
    }
}

export async function createPatient(data: {
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender: "female" | "male" | "other";
    contactNumber?: string;
    email?: string;
    address?: string;
    medicalHistory?: string;
    assignedDoctorId?: string;
}) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "admin") {
            throw new Error("Unauthorized: Only administrators can create patients.");
        }

        const [newPatient] = await db.insert(patients).values({
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            contactNumber: data.contactNumber,
            email: data.email,
            address: data.address,
            medicalHistory: data.medicalHistory,
            assignedDoctorId: data.assignedDoctorId
        }).returning();

        revalidatePath("/patients");
        return newPatient;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to create patient: ${errorMessage}`);
    }
}

export async function updatePatient(id: string, data: Partial<typeof patients.$inferInsert>) {
    try {
        const [updatedPatient] = await db.update(patients)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(patients.id, id))
            .returning();
            
        revalidatePath("/patients");
        return updatedPatient;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to update patient: ${errorMessage}`);
    }
}

export async function deletePatient(id: string) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error("Unauthorized: Please log in.");
        }
        if (user.role !== "admin") {
            throw new Error("Forbidden: Only administrators can delete patient records.");
        }

        await db.delete(patients).where(eq(patients.id, id));
        revalidatePath("/patients");
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to delete patient: ${errorMessage}`);
    }
}
