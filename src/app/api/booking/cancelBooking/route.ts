import { protectUser } from "@/middleware/userAuth";
import bookingModel from "@/models/bookingModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { bookingId } = await req.json();

        const { authorized, user } = await protectUser();
        if (!authorized || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return NextResponse.json({ success: false, message: "Booking not found" }, { status: 401 });
        }

        await bookingModel.findByIdAndDelete(booking);

        return NextResponse.json({ success: true, message: "Booking cancelled" });

    } catch (error) {   
        const errMessage = error instanceof Error ? error.message : "An unkwnow error occurred";
        return NextResponse.json({ success: false, message: errMessage });
    }
};