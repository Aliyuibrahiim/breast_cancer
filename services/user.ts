"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getUserById(userId: string) {
    try {
        const userResults = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            isVerified: users.isVerified,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
        }).from(users).where(eq(users.id, userId));
        
        const user = userResults[0];

        if (!user) throw new Error("User not found");
        return user;
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        const errorCause = error.cause ? String(error.cause) : "";
        throw new Error(`Failed to fetch user profile: ${errorMessage} ${errorCause}`);
    }
}

export async function getUserByEmail(email: string) {
    try {
        const userResults = await db.select().from(users).where(eq(users.email, email));
        return userResults[0];
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch user by email: ${errorMessage}`);
    }
}

export async function getPrimaryDoctor() {
    try {
        const userResults = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
        }).from(users).where(eq(users.role, "doctor")).limit(1);
        
        return userResults[0] || null;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch primary doctor: ${errorMessage}`);
    }
}

export async function updateDoctorProfile(id: string, data: { name: string; email: string }) {
    try {
        const [updatedUser] = await db.update(users)
            .set({ 
                name: data.name, 
                email: data.email,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email
            });
            
            
        return updatedUser;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to update profile: ${errorMessage}`);
    }
}

import bcrypt from "bcryptjs";

export async function updatePassword(id: string, newPassword: string) {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.update(users)
            .set({ 
                password: hashedPassword,
                updatedAt: new Date()
            })
            .where(eq(users.id, id));
            
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to update password: ${errorMessage}`);
    }
}
