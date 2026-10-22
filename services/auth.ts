"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function createUserRecord(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const verifyToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const verifyTokenExpiry = new Date(Date.now() + 3600000); 

    await db.insert(users).values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        verifyToken,
        verifyTokenExpiry,
    });

    return verifyToken;
}

export async function verifyUserEmail(token: string) {
    const userResults = await db.select().from(users).where(
        and(
            eq(users.verifyToken, token),
            gt(users.verifyTokenExpiry, new Date())
        )
    );
    const user = userResults[0];

    if (!user) throw new Error("Invalid or expired token");

    await db.update(users)
        .set({ 
            isVerified: true, 
            verifyToken: null, 
            verifyTokenExpiry: null 
        })
        .where(eq(users.id, user.id));

    return user;
}

export async function setPasswordResetToken(email: string) {
    const userResults = await db.select().from(users).where(eq(users.email, email));
    const user = userResults[0];

    if (!user) return null;

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpire = new Date(Date.now() + 3600000); // 1 hour

    await db.update(users)
        .set({ 
            resetPasswordToken: resetToken, 
            resetPasswordExpire: resetTokenExpire 
        })
        .where(eq(users.id, user.id));

    return resetToken;
}

export async function resetUserPassword(token: string, newPassword: string) {
    const userResults = await db.select().from(users).where(
        and(
            eq(users.resetPasswordToken, token),
            gt(users.resetPasswordExpire, new Date())
        )
    );
    const user = userResults[0];

    if (!user) throw new Error("Invalid or expired password reset token");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.update(users)
        .set({ 
            password: hashedPassword, 
            resetPasswordToken: null, 
            resetPasswordExpire: null 
        })
        .where(eq(users.id, user.id));

    return user;
}
