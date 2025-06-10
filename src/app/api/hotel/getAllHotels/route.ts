import hotelModel from "@/models/hotelModel";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const hotels = await hotelModel.find({});
        return NextResponse.json({ success: true, hotels });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ success: false, message: errMessage });
    }
};