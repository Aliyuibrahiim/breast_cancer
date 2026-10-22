import { NextResponse } from "next/server";
import { verifyUserEmail } from "@/services/auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json({ message: "No token provided" }, { status: 400 });
        }

        await verifyUserEmail(token);

        return NextResponse.redirect(new URL("/login?verified=true", req.url));

    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }
}
