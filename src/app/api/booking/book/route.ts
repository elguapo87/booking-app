import { protectUser } from "@/middleware/userAuth";
import bookingModel from "@/models/bookingModel";
import roomModel from "@/models/roomModel";
import { availability } from "@/utils/availability";
import { NextRequest, NextResponse } from "next/server";
import "@/models/hotelModel";

export async function POST(req: NextRequest) {
    const { room, checkInDate, checkOutDate, guests } = await req.json();

    const { authorized, user } = await protectUser();
    if (!authorized || !user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Before booking check availability
        const isAvailable = await availability({ room, checkInDate, checkOutDate });
        if (!isAvailable) return NextResponse.json({ success: false, message: "Room is not available" });

        // Get total price for room
        const roomData = await roomModel.findById(room).populate("hotel");

        let totalPrice = roomData.pricePerNight;

        // Calculate total price based on nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        totalPrice *= nights;

        await bookingModel.create({
            user,
            room,
            hotel: roomData.hotel._id,
            checkInDate,
            checkOutDate,
            guests: +guests,
            totalPrice
        });

        return NextResponse.json({ success: true, message: "Booking created successfully" });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};