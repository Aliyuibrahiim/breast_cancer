import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/mailer";
import { getUserByEmail } from "@/services/user";
import { createUserRecord } from "@/services/auth";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json({
                message: "Password does not meet security requirements. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            }, { status: 400 });
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ message: "Email is already registered" }, { status: 400 });
        }

        const verifyToken = await createUserRecord({ name, email, password });
        await sendVerificationEmail(email, verifyToken);

        return NextResponse.json(
            { message: "Registration successful. Please check your email to verify." },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json({ message: "An error occurred during registration: " + (error.message || error) }, { status: 500 });
    }
}
