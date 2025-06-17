import bookingModel from "@/models/bookingModel";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    // Stripe gateway initialize
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) throw new Error("STRIPE_SECRET_KEY is missing or not defined in .env file");
    const stripeInstance = new Stripe(stripeSecretKey);

    const sig = req.headers.get("stripe-signature");

    let event;

    try {
        const rawBody = await req.arrayBuffer();
        const buffer = Buffer.from(rawBody);
        event = stripeInstance.webhooks.constructEvent(
            buffer,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json(`Webhook Error ${errMessage}`, { status: 400 });
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Getting session metadata
        const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId
        });

        const metadata = session.data[0].metadata;
        const bookingId = metadata ? metadata.bookingId : undefined;

        // Mark payment as paid
        await bookingModel.findByIdAndUpdate(bookingId, {
            isPaid: true,
            paymentMethod: "Stripe"
        });

    } else {
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
};