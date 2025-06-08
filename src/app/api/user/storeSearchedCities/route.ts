import { protectUser } from "@/middleware/userAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const recentSearchedCities = await req.json();
        const { authorized, user } = await protectUser();
        if (!authorized || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const cities = Array.isArray(recentSearchedCities) ? recentSearchedCities : [recentSearchedCities];

        for (const city of cities) {
            if (typeof city !== "string") continue; // Skip invalid entries

            // Prevent duplicates
            if (!user.recentSearchedCities.includes(city)) {
                if (user.recentSearchedCities.length >= 3) {
                    user.recentSearchedCities.shift();
                }

                user.recentSearchedCities.push(city);
            }
        }

        await user.save();

        return NextResponse.json({ success: true, message: "City or cities added" });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};