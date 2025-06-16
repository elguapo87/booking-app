import { protectUser } from "@/middleware/userAuth";
import bookingModel from "@/models/bookingModel";
import roomModel from "@/models/roomModel";
import { availability } from "@/utils/availability";
import { NextRequest, NextResponse } from "next/server";
import "@/models/hotelModel";
import transporter from "@/config/nodemailer";

export async function POST(req: NextRequest) {
    const { room, checkInDate, checkOutDate, guests } = await req.json();

    const { authorized, user } = await protectUser();
    if (!authorized || !user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Before booking check availability
        const isAvailable = await availability({ room, checkInDate, checkOutDate });
        if (!isAvailable) return NextResponse.json({ success: false, message: "Room is not available" });

        // Get total price for room
        const roomData = await roomModel.findById(room).populate("hotel");

        let totalPrice = roomData.pricePerNight;

        // Calculate total price based on nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        totalPrice *= nights;

        const booking = await bookingModel.create({
            user,
            room,
            hotel: roomData.hotel._id,
            checkInDate,
            checkOutDate,
            guests: +guests,
            totalPrice
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Hotel Booking Details",
            html: `
                <h2>Your Booking Details</h2>
                <p>Dear ${user.username || user.email},</p>
                <p>Thank you for your booking! Here are your details:</p>
                <ul>
                   <li><strong>Booking ID:</strong> ${booking._id}</li>
                   <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                   <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                   <li><strong>Date:</strong> ${booking.checkInDate.toDateString()} to ${booking.checkOutDate.toDateString()}</li>
                   <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || "$"} ${booking.totalPrice}</li>
                </ul>
                <p>We look forward to welcoming you!</p>
                <p>If you need to make any changes, feel free to contact us.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Booking created successfully" });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};