"use server";

import { db } from "@/lib/db";
import { patients, diagnostics, users } from "@/lib/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";

export async function getDashboardStats() {
    try {
        const totalPatientsResult = await db.select({ count: count() }).from(patients);
        const totalPatients = totalPatientsResult[0].count;

        const totalScreeningsResult = await db.select({ count: count() }).from(diagnostics);
        const totalScreenings = totalScreeningsResult[0].count;

        const highRiskResult = await db.select({ count: count() })
            .from(diagnostics)
            .where(eq(diagnostics.predictionResult, 'malignant'));
        const highRiskCases = highRiskResult[0].count;

        return {
            totalPatients,
            totalScreenings,
            pendingReview: 0, // In a real app, track this status
            highRiskCases,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch dashboard stats: ${errorMessage}`);
    }
}

export async function getRecentPatients(limit = 5) {
    try {
        return await db
            .select()
            .from(patients)
            .orderBy(desc(patients.createdAt))
            .limit(limit);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch recent patients: ${errorMessage}`);
    }
}

export async function getDiagnosticTrends() {
    try {
        // We'll aggregate by month (e.g. Jan, Feb) for the current year
        // We can do this in SQL or pull records and aggregate in JS. JS is easier for cross-DB compatibility.
        const allDiagnostics = await db
            .select({
                createdAt: diagnostics.createdAt,
                predictionResult: diagnostics.predictionResult
            })
            .from(diagnostics);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Initialize 12 months with 0
        const monthlyData = monthNames.map(name => ({
            name,
            Malignant: 0,
            Benign: 0,
            total: 0
        }));

        allDiagnostics.forEach(diag => {
            const date = new Date(diag.createdAt);
            // Optional: Filter for current year only
            // if (date.getFullYear() !== new Date().getFullYear()) return;
            
            const monthIndex = date.getMonth();
            if (diag.predictionResult === 'malignant') {
                monthlyData[monthIndex].Malignant++;
            } else {
                monthlyData[monthIndex].Benign++;
            }
            monthlyData[monthIndex].total++;
        });

        // Filter to only return months up to current month (or all if you want to show full year)
        const currentMonthIndex = new Date().getMonth();
        return monthlyData.slice(0, currentMonthIndex + 1);
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch diagnostic trends: ${errorMessage}`);
    }
}

export async function getAdminAnalyticsData() {
    try {
        // Get Total Cases (Screenings)
        const totalScreeningsResult = await db.select({ count: count() }).from(diagnostics);
        const totalCases = totalScreeningsResult[0].count;

        // Get Malignant and Benign counts for Donut Chart
        const malignantResult = await db.select({ count: count() })
            .from(diagnostics)
            .where(eq(diagnostics.predictionResult, 'malignant'));
        const malignantCount = malignantResult[0].count;
        const benignCount = totalCases - malignantCount;

        // Fetch recent activity timeline (latest 5 diagnostics with patient and doctor details)
        const recentDiagnosticsRaw = await db
            .select({
                id: diagnostics.id,
                predictionResult: diagnostics.predictionResult,
                confidenceScore: diagnostics.confidenceScore,
                createdAt: diagnostics.createdAt,
                patientId: patients.id,
                patientFirstName: patients.firstName,
                patientLastName: patients.lastName,
                doctorName: users.name,
            })
            .from(diagnostics)
            .innerJoin(patients, eq(diagnostics.patientId, patients.id))
            .leftJoin(users, eq(diagnostics.doctorId, users.id))
            .orderBy(desc(diagnostics.createdAt))
            .limit(8);

        const recentActivity = recentDiagnosticsRaw.map(d => ({
            id: d.id,
            patientId: d.patientId,
            patientName: `${d.patientFirstName} ${d.patientLastName}`,
            predictionResult: d.predictionResult,
            confidenceScore: d.confidenceScore,
            createdAt: d.createdAt,
            doctorName: d.doctorName || "Unknown",
        }));

        // Mock values for Accuracy Rating and Peer Reviews since they aren't fully modelled
        const accuracyRating = "98.4%"; 
        const peerReviews = "124";

        return {
            totalCases,
            malignantCount,
            benignCount,
            recentActivity,
            accuracyRating,
            peerReviews
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch admin analytics: ${errorMessage}`);
    }
}
