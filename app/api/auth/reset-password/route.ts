import { NextResponse } from "next/server";
import { resetUserPassword } from "@/services/auth";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ message: "Token and new password are required" }, { status: 400 });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json({
                message: "Password does not meet security requirements. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            }, { status: 400 });
        }

        await resetUserPassword(token, password);

        return NextResponse.json({ message: "Password has been successfully reset. You can now log in." }, { status: 200 });

    } catch (error: any) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ message: "An error occurred while resetting your password." }, { status: 500 });
    }
}
