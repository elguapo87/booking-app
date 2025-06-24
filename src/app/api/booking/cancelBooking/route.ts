import { protectUser } from "@/middleware/userAuth";
import bookingModel from "@/models/bookingModel";
import { NextRequest, NextResponse } from "next/server";
import "@/models/hotelModel";
import "@/models/roomModel";
import "@/models/userModel";
import transporter from "@/config/nodemailer";

export async function POST(req: NextRequest) {
    try {
        const { bookingId } = await req.json();

        const { authorized, user } = await protectUser();
        if (!authorized || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const booking = await bookingModel.findById(bookingId).populate([
            {
                path: "user",
            },
            {
                path: "room",
                populate: {
                    path: "hotel",
                },
            },
        ]);

        if (!booking) {
            return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: booking.user.email,
            subject: "Booking Cancellation Confirmation",
            html: `
                <h2>Your Booking Has Been Cancelled</h2>
                <p>Dear ${booking.user.username || booking.user.email},</p>
                <p>Your booking has been successfully cancelled. Here are the details:</p>
                <ul>
                    <li><strong>Booking ID:</strong> ${booking._id}</li>
                    <li><strong>Hotel Name:</strong> ${booking.room.hotel.name}</li>
                    <li><strong>Location:</strong> ${booking.room.hotel.address}</li>
                    <li><strong>Dates:</strong> ${new Date(booking.checkInDate).toDateString()} to ${new Date(booking.checkOutDate).toDateString()}</li>
                    <li><strong>Total Amount:</strong> ${process.env.CURRENCY || "$"} ${booking.totalPrice}</li>
                </ul>
                <p>We're sorry to see you cancel. If you change your mind, you're always welcome to rebook.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        await bookingModel.findByIdAndDelete(bookingId);

        return NextResponse.json({ success: true, message: "Booking cancelled and email sent" });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
    }
}
