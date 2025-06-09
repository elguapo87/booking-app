import { protectUser } from "@/middleware/userAuth";
import hotelModel from "@/models/hotelModel";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, address, contact, city } = await req.json();

        const { authorized, user } = await protectUser();
        if (!authorized || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const owner = user._id;

        // Check if user is already registered
        const hotel = await hotelModel.findOne({ owner });
        if (hotel) {
            return NextResponse.json({ success: false, message: "Hotel already registered" });
        }

        await hotelModel.create({
            name,
            address,
            contact,
            city,
            owner
        });

        await userModel.findByIdAndUpdate(owner, { role: "hotelOwner" });

        return NextResponse.json({ success: true, message: "Hotel registered successfully" });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};