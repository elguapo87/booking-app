"use client"

import { Suspense } from "react";
import AllRooms from "./AllRooms";

export default function AllRoomsWrapper() {
    return (
        <Suspense fallback={<div>Loading rooms...</div>}>
            <AllRooms />
        </Suspense>
    )
}
