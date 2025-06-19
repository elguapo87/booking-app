import { Suspense } from "react";
import HotelDetails from "./HotelDetails";
import Loader from "./Loader";

export default function HotelDetailsWrapper() {
    return (
        <Suspense fallback={<Loader />}>
            <HotelDetails />
        </Suspense>
    )
}