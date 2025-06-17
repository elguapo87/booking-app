import { protectUser } from "@/middleware/userAuth";
import bookingModel from "@/models/bookingModel";
import hotelModel from "@/models/hotelModel";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { authorized, user } = await protectUser();
        if (!authorized || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const owner = user._id;

        const hotel = await hotelModel.findOne({ owner });
        if (!hotel) return NextResponse.json({ success: false, message: "Hotel not found" });

        const bookings = await bookingModel.find({ hotel: hotel._id }).populate("user room hotel").sort({ createdAt: -1 });

        // Total bookings
        const totalBookings = bookings.length;

        // Total revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        return NextResponse.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });

    } catch (error) {
        console.error("Get Owner Bookings Error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch bookings" });
    }
};