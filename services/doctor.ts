"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth/session";

export async function createDoctor(data: {
    name: string;
    email: string;
    password?: string;
}) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "admin") {
            throw new Error("Unauthorized: Only administrators can create doctors.");
        }

        // Check if user already exists
        const existingUsers = await db.select().from(users).where(eq(users.email, data.email));
        if (existingUsers.length > 0) {
            throw new Error("A user with this email already exists");
        }

        const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;

        const [newDoctor] = await db.insert(users).values({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: "doctor",
            isVerified: true, // Auto-verified since created by admin
        }).returning();

        revalidatePath("/patients");
        return newDoctor;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to create doctor: ${errorMessage}`);
    }
}

export async function getDoctors() {
    try {
        return await db.select({
            id: users.id,
            name: users.name,
            email: users.email
        }).from(users).where(eq(users.role, "doctor")).orderBy(desc(users.createdAt));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch doctors: ${errorMessage}`);
    }
}
