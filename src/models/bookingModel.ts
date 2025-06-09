import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        ref: "user",
        type: String,
        required: true
    },
    room: {
        ref: "room",
        type: String,
        required: true
    },
    hotel: {
        ref: "hotel",
        type: String,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    totelPrice: {
        type: Number,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        required: true,
        default: "Pay At Hotel"
    },
    isPaid: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const bookingModel = mongoose.models.booking || mongoose.model("booking", bookingSchema);

export default bookingModel;