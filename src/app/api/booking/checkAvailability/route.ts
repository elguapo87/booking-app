import roomModel from "@/models/roomModel";
import { availability } from "@/utils/availability";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { checkInDate, checkOutDate, room } = await req.json();

        const isAvailable = await availability({ checkInDate, checkOutDate, room });

        return NextResponse.json({ success: true, isAvailable });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};