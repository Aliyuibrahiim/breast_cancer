import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

    // We destroy the session by overwriting the cookie with an empty string 
    // and setting its expiration date to the past (Date(0))
    response.cookies.set({
        name: "auth_token",
        value: "",
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });

    return response;
}
