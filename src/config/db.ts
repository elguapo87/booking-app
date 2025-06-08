import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Database Connected");
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`);

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.log(errMessage);
    }
};

export default connectDB;