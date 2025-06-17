import { protectUser } from "@/middleware/userAuth";
import bookingModel from "@/models/bookingModel";
import roomModel from "@/models/roomModel";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    try {
        const { authorized, user } = await protectUser();
        if (!authorized || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { bookingId } = await req.json();

        const booking = await bookingModel.findById(bookingId);

        const roomData = await roomModel.findById(booking.room).populate("hotel");

        const totalPrice = booking.totalPrice;

        const origin = req.headers.get("origin");

        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeSecretKey) throw new Error("STRIPE_SECRET_KEY is missing or not defined in .env file");
        const stripeInstance = new Stripe(stripeSecretKey);

        const line_items = [
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: roomData.hotel.name,
                    },
                    unit_amount: totalPrice * 100
                },
                quantity: 1,
            }
        ]

        // Create checkout session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader/myBookings`,
            cancel_url: `${origin}/myBookings`,
            metadata: {
                bookingId
            }
        });
        
        return NextResponse.json({ success: true, url: session.url });

    } catch (error) {
        console.error("Stripe Payment error:", error);
        return NextResponse.json({ success: false, message: "Payment Failed" });
    }
};