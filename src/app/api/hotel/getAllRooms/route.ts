import connectDB from "@/config/db";
import roomModel from "@/models/roomModel";
import { NextResponse } from "next/server";
import "@/models/hotelModel";
import "@/models/userModel";

export async function GET() {
    try {
        await connectDB();

        const rooms = await roomModel.find({ isAvailable: true }).populate({
            path: "hotel",
            populate: {
                path: "owner",
                select: "image"
            }
        }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, rooms });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};