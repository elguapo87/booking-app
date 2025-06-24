import transporter from "@/config/nodemailer";
import { protectUser } from "@/middleware/userAuth";
import bookingModel from "@/models/bookingModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { bookingId } = await req.json();

        const { authorized, user } = await protectUser();
        if (!authorized || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return NextResponse.json({ success: false, message: "Booking not found" }, { status: 401 });
        }

         // Send cancellation email before deleting
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Booking Cancellation Confirmation",
            html: `
                <h2>Your Booking Has Been Cancelled</h2>
                <p>Dear ${user.username || user.email},</p>
                <p>Your booking has been successfully cancelled. Here are the details of the cancelled booking:</p>
                <ul>
                    <li><strong>Booking ID:</strong> ${booking._id}</li>
                    <li><strong>Hotel Name:</strong> ${booking.room.hotel.name}</li>
                    <li><strong>Location:</strong> ${booking.room.hotel.address}</li>
                    <li><strong>Original Dates:</strong> ${new Date(booking.checkInDate).toDateString()} to ${new Date(booking.checkOutDate).toDateString()}</li>
                    <li><strong>Total Amount:</strong> ${process.env.CURRENCY || "$"} ${booking.totalPrice}</li>
                </ul>
                <p>If this was a mistake or you have questions, feel free to contact us.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        await bookingModel.findByIdAndDelete(booking);

        return NextResponse.json({ success: true, message: "Booking cancelled" });

    } catch (error) {   
        const errMessage = error instanceof Error ? error.message : "An unkwnow error occurred";
        return NextResponse.json({ success: false, message: errMessage });
    }
};