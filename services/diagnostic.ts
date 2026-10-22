"use server";

import { db } from "@/lib/db";
import { diagnostics } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";



export async function saveDiagnosticResult(data: {
    patientId: string;
    doctorId?: string; // Will be extracted from session later
    predictionResult: "benign" | "malignant";
    confidenceScore: string;
    notes?: string;
}) {
    try {
        const [result] = await db.insert(diagnostics).values({
            patientId: data.patientId,
            // doctorId: data.doctorId, // Skipping for now until full auth integration
            predictionResult: data.predictionResult,
            confidenceScore: data.confidenceScore,
            notes: data.notes,
        }).returning();

        revalidatePath(`/patients/${data.patientId}`);
        revalidatePath(`/dashboard`);
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to save diagnostic result: ${errorMessage}`);
    }
}

export async function getDiagnosticsForPatient(patientId: string) {
    try {
        return await db
            .select()
            .from(diagnostics)
            .where(eq(diagnostics.patientId, patientId))
            .orderBy(desc(diagnostics.createdAt));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch diagnostics: ${errorMessage}`);
    }
}
