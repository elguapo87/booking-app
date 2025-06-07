import Navbar from "@/components/hotelOwner/Navbar";
import Sidebar from "@/components/hotelOwner/Sidebar";

export default function HotelOwnerLayout ({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-col h-screen max-md:mb-50">
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
