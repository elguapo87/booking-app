import connectDB from "@/config/db";
import roomModel from "@/models/roomModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { roomId } = await req.json();

        await connectDB();

        const roomData = await roomModel.findById(roomId);

        roomData.isAvailable = !roomData.isAvailable;

        await roomData.save();

        return NextResponse.json({ success: true, message: "Availability changed" });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};