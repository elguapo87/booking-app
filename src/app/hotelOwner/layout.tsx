"use client"

import Navbar from "@/components/hotelOwner/Navbar";
import Sidebar from "@/components/hotelOwner/Sidebar";
import { AppContext } from "@/context/AppContext";
import { useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function HotelOwnerLayout ({ children }: { children: React.ReactNode }) {

    const context = useContext(AppContext);                                             
    if (!context) throw new Error("HotelOwnerLayout must be within AppContextProvider");
    const { isOwner, router } = context;

    useEffect(() => {
        if (!isOwner) {
            router.push("/");
        }
    }, [isOwner]);

    return (
        <>
            <div className="flex flex-col h-screen max-md:mb-50">
                <Toaster />
                <Navbar />
                <div className="flex h-full">
                    <Sidebar />

                    <div className="flex-1 p-4 pt-5 md:pt-10 md:px-10 h-full">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}
