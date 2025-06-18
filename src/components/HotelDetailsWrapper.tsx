import { Suspense } from "react";
import HotelDetails from "./HotelDetails";

export default function HotelDetailsWrapper() {
    return (
        <Suspense fallback={<div>Loading rooms...</div>}>
            <HotelDetails />
        </Suspense>
    )
}