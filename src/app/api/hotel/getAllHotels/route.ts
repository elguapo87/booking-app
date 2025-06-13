import hotelModel from "@/models/hotelModel";
import { NextResponse } from "next/server";
import "@/models/userModel";

export async function GET() {
    try {
        const hotels = await hotelModel.find({}).populate({
            path: "owner",
            select: "username image",
        });
        return NextResponse.json({ success: true, hotels });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ success: false, message: errMessage });
    }
};