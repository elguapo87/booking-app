import { protectUser } from "@/middleware/userAuth";
import bookingModel from "@/models/bookingModel";
import { NextResponse } from "next/server";
import "@/models/roomModel";
import "@/models/hotelModel";

export async function GET() {
    try {
        const { authorized, user } = await protectUser();
        if (!authorized || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const bookings = await bookingModel.find({ user: user._id }).populate("room hotel");

        return NextResponse.json({ success: true, bookings });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch bookings" }, { status: 500 });
    }
};