import bookingModel from "@/models/bookingModel";

type CheckAvailabilityParams = {
    checkInDate: Date;
    checkOutDate: Date;
    room: string;
};

export const availability = async ({ checkInDate, checkOutDate, room }: CheckAvailabilityParams) => {
    const bookings = await bookingModel.find({
        checkInDate: { $lte: checkOutDate },
        checkOutDate: { $gte: checkInDate },
        room
    });

    return bookings.length === 0;
};