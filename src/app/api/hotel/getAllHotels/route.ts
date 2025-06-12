import hotelModel from "@/models/hotelModel";
import { NextResponse } from "next/server";
import "@/models/userModel";
import "@/models/roomModel";

export async function GET() {
    try {
        const hotels = await hotelModel.aggregate([
            {
                $lookup: {
                    from: "users", // the MongoDB collection name for userModel
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                }
            },
            {
                $unwind: "$owner"
            },
            {
                $lookup: {
                    from: "rooms", // the MongoDB collection name for roomModel
                    localField: "_id",
                    foreignField: "hotel",
                    as: "rooms"
                }
            },
            {
                $project: {
                    name: 1,
                    address: 1,
                    contact: 1,
                    city: 1,
                    image: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    owner: {
                        username: "$owner.username",
                        image: "$owner.image"
                    },
                    rooms: 1
                }
            }
        ]);

        return NextResponse.json({ success: true, hotels });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ success: false, message: errMessage });
    }
}
