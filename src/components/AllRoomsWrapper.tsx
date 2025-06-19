"use client"

import { Suspense } from "react";
import AllRooms from "./AllRooms";
import Loader from "./Loader";

export default function AllRoomsWrapper() {
    return (
        <Suspense fallback={<Loader />}>
            <AllRooms />
        </Suspense>
    )
}
