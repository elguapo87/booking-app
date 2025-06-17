import cloudinary from "@/config/cloudinary";
import { protectUser } from "@/middleware/userAuth";
import hotelModel from "@/models/hotelModel";
import roomModel from "@/models/roomModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) { 
    try {
        const { authorized, user } = await protectUser();
        if (!authorized || !user)  return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const roomType = formData.get("roomType") as string;
        const pricePerNight = parseFloat(formData.get("pricePerNight") as string);
        const amenities = JSON.parse(formData.get("amenities") as string) || [];

        const roomId = formData.get("roomId") as string;

        const room = await roomModel.findById(roomId).populate("hotel");
        if (!room) return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 });

        // Check if user owns the hotel that owns the room
        const hotel = await hotelModel.findById(room.hotel._id);

        if (!hotel || hotel.owner.toString() !== user._id.toString()) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const existingImages = formData.getAll("existingImages") as string[];
        const newImages = formData.getAll("images") as File[];

        const imageUrls = [...existingImages];

        if (newImages.length > 0) {
            if (newImages.length + existingImages.length > 4) {
                return NextResponse.json({ success: false, message: "You can upload up to 4 images" });
            }

            for (const image of newImages) {
                const buffer = Buffer.from(await image.arrayBuffer());
                const upload = await cloudinary.uploader.upload(`data:image/png;base64,${buffer.toString("base64")}`, {
                    folder: "hotels/rooms"
                });

                imageUrls.push(upload.secure_url);
            }
        }

        await roomModel.findByIdAndUpdate(roomId, {
            roomType,
            pricePerNight,
            amenities,
            images: imageUrls
        });

        return NextResponse.json({ success: true, message: "Room updated successfully" });
        
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};