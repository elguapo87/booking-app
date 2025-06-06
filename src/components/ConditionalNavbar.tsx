"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar";

const ConditionalNavbar = () => {

    const pathName = usePathname();
    const isOwnerPath = pathName.includes("hotelOwner");

    return (
        <div>
            {!isOwnerPath && <Navbar />}
        </div>
    )
}

export default ConditionalNavbar


