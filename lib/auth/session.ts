import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserById } from "@/services/user";

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };
        
        if (!decoded || !decoded.id) {
            return null;
        }

        const user = await getUserById(decoded.id);
        
        return user;
    } catch (error) {
        console.error("Session Verification Error:", error);
        return null;
    }
}
