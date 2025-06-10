import cloudinary from "@/config/cloudinary";
import { protectUser } from "@/middleware/userAuth";
import hotelModel from "@/models/hotelModel";
import roomModel from "@/models/roomModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const roomType = formData.get("roomType") as string;
        const pricePerNight = parseFloat(formData.get("pricePerNight") as string);
        const amenities = JSON.parse(formData.get("amenities") as string) || [];

        const images = formData.getAll("images") as File[];
        if (images.length > 4) return NextResponse.json({ success: false, message: "You can upload up to 4 images" });

        const { authorized, user } = await protectUser();
        if (!authorized || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const owner = user._id;

        const hotel = await hotelModel.findOne({ owner });
        if (!hotel) return NextResponse.json({ success: false, message: "No hotel found" });

        const imageUrls: string[] = [];

        for (const image of images) {
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload images to cloudinary
            const uploadImages = await cloudinary.uploader.upload(`data:image/png;base64,${buffer.toString("base64")}`, {
                folder: "hotels/rooms"
            });

            imageUrls.push(uploadImages.secure_url);
        }

        await roomModel.create({
            hotel: hotel._id,
            roomType,
            pricePerNight,
            amenities,
            images: imageUrls
        });

        return NextResponse.json({ success: true, message: "Room added" })

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};