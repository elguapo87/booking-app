import bookingModel from "@/models/bookingModel";

type CheckAvailabilityParams = {
    checkInDate: Date;
    checkOutDate: Date;
    room: string;
};

export const availability = async ({ checkInDate, checkOutDate, room }: CheckAvailabilityParams) => {
    const bookings = await bookingModel.find({
        room,
        checkInDate: { $lte: checkOutDate },
        checkOutDate: { $gte: checkInDate }
    });

    return bookings.length === 0;
};