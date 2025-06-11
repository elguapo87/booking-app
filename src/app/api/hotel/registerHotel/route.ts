import cloudinary from "@/config/cloudinary";
import { protectUser } from "@/middleware/userAuth";
import hotelModel from "@/models/hotelModel";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const address = formData.get("address") as string;
        const contact = formData.get("contact") as string;
        const city = formData.get("city") as string;
        const image = formData.get("image") as File;

        const { authorized, user } = await protectUser();
        if (!authorized || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const owner = user._id;

        // Check if user is already registered
        const hotel = await hotelModel.findOne({ owner });
        if (hotel) {
            return NextResponse.json({ success: false, message: "Hotel already registered" });
        }

        // Upload the image to Cloudinary
        let imageUrl = "";
        if (image) {
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadRes = await cloudinary.uploader.upload(`data:image/jpeg;base64,${buffer.toString("base64")}`, {
                folder: "hotels",
            });

            imageUrl = uploadRes.secure_url;
        }

        await hotelModel.create({
            name,
            address,
            contact,
            city,
            owner,
            image: imageUrl
        });

        await userModel.findByIdAndUpdate(owner, { role: "hotelOwner" });

        return NextResponse.json({ success: true, message: "Hotel registered successfully" });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};