import { protectUser } from "@/middleware/userAuth";
import { NextResponse } from "next/server";

export async function GET() {
    const { authorized, user } = await protectUser();
    if (!authorized || !user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const role = user.role;
        const recentSearchedCities = user.recentSearchedCities;

        return NextResponse.json({ success: true, role, recentSearchedCities });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};