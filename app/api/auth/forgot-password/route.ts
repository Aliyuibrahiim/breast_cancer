import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { setPasswordResetToken } from "@/services/auth";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const resetToken = await setPasswordResetToken(email);

        if (!resetToken) {
            return NextResponse.json({ message: "If an account with that email exists, we have sent a reset link." }, { status: 200 });
        }

        await sendPasswordResetEmail(email, resetToken);

        return NextResponse.json({ message: "If an account with that email exists, we have sent a reset link." }, { status: 200 });

    } catch (error: any) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ message: "An error occurred while processing your request." }, { status: 500 });
    }
}
