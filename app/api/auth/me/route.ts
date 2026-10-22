import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserById } from "@/services/user";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };

        const user = await getUserById(decoded.id);

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        console.error("Get User Error:", error);
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
}
