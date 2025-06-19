import { NextRequest, NextResponse } from "next/server";
import { protectUser } from "@/middleware/userAuth";
import hotelModel from "@/models/hotelModel";
import roomModel from "@/models/roomModel";

export async function POST(req: NextRequest) {
  try {
    // ✅ Authenticate user
    const { authorized, user } = await protectUser();
    if (!authorized || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Parse JSON body
    const body = await req.json();
    const { roomId, roomType, pricePerNight, description, amenities, images } = body;

    // ✅ Validate input
    if (!roomId || !roomType || !pricePerNight || !Array.isArray(amenities) || !Array.isArray(images)) {
      return NextResponse.json({ success: false, message: "Missing or invalid fields" }, { status: 400 });
    }

    if (images.length > 4) {
      return NextResponse.json({ success: false, message: "You can upload up to 4 images" }, { status: 400 });
    }

    // ✅ Find room and verify ownership
    const room = await roomModel.findById(roomId).populate("hotel");
    if (!room) return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 });

    const hotel = await hotelModel.findById(room.hotel._id);
    if (!hotel || hotel.owner.toString() !== user._id.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // ✅ Update room in database
    await roomModel.findByIdAndUpdate(roomId, {
      roomType,
      pricePerNight,
      description,
      amenities,
      images,
    });

    return NextResponse.json({ success: true, message: "Room updated successfully" });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
