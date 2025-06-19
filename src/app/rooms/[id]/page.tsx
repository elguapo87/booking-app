"use client"

import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react";
import { assets, facilityIcons, roomCommonData } from "../../../../public/assets";
import { RoomType } from "@/types";
import Image, { StaticImageData } from "next/image";
import StarRating from "@/components/StarRating";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useClerk } from "@clerk/nextjs";

const RoomDetails = () => {

    const context = useContext(AppContext);
    if (!context) throw new Error("RoomDetails must be within AppContextProvider");
    const { router, rooms, getToken, axios, currency, user } = context;

    const { openSignIn } = useClerk();

    const { id } = useParams() as { id: string };
    const [room, setRoom] = useState<RoomType | null>(null);
    const [mainImage, setMainImage] = useState<string | StaticImageData | null>(null);

    const [checkInDate, setCheckInDate] = useState<string | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
    const [guests, setGuests] = useState(1);
    const [isAvaliable, setIsAvailable] = useState(false);

    const [loading, setLoading] = useState(false);

    const [showNumber, setShowNumber] = useState(false);

    const checkAvailability = async () => {
        try {
            // Check if check-in-date is greater then check-out-date
            if ((checkInDate && checkOutDate) && (checkInDate >= checkOutDate)) {
                toast.error("Check-in date should be less then check-out date");
                return;
            }

            const { data } = await axios.post("/api/booking/checkAvailability", { checkInDate, checkOutDate, room: id });

            if (data.success) {
                if (data.isAvailable) {
                    setIsAvailable(true);
                    toast.success("Room is avaliable");

                } else {
                    setIsAvailable(false);
                    toast.error("Room is not avaliable")
                }

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };

    // onSubmitHandler function to check availability & book the room
    const onSubmitHandler = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        setLoading(true);

        const token = await getToken();

        if (!user) {
            toast.error("Login to book");
            setTimeout(() => openSignIn(), 1500);
            return;
        }

        try {
            if (!isAvaliable) {
                return checkAvailability();

            } else {
                const { data } = await axios.post("/api/booking/book", { room: id, checkInDate, checkOutDate, guests, paymentMethod: "Pay At Hotel" }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (data.success) {
                    toast.success(data.message);
                    router.push("/myBookings");
                    scrollTo(0, 0);

                } else {
                    toast.error(data.message);
                }
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const foundRoom = rooms.find((room) => room._id === id);
        if (foundRoom) {
            setRoom(foundRoom);
            setMainImage(foundRoom.images[0]);
        }
    }, [rooms, id]);


    return room && (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            {/* ROOM DETAILS */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>
                    {room.hotel.name}
                    <span className='font-inter text-sm'>({room.roomType})</span>
                </h1>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
            </div>

            {/* ROOM RATING */}
            <div className='flex items-center gap-1 mt-2'>
                <StarRating />
                <p className='ml-2'>200+ reviews</p>
            </div>

            {/* ROOM ADDRESS */}
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <Image src={assets.locationIcon} alt='Location-Icon' />
                <span>{room.hotel.address}</span>
            </div>

            {/* ROOM IMAGES */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-1/2 w-full aspect-[4/3] relative rounded-xl shadow-lg overflow-hidden'>
                    {mainImage && (
                        <Image src={mainImage} alt='Room-Image' fill className='object-cover rounded-xl' />
                    )}
                </div>

                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                    {room?.images.length > 1 && room.images.map((image, index) => (
                        <div key={index} onClick={() => setMainImage(image)} className={`rounded-xl shadow-md cursor-pointer overflow-hidden ${mainImage === image ? 'outline-3 outline-orange-500' : ''}`}>
                            <Image src={image} width={400} height={300} alt='Room-Image' className="object-cover w-full h-full rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>

            {/* ROOM HIGHLIGHTS */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl md:text-4xl font-playfair'>{room.description}</h1>
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                        {room.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                                <Image src={facilityIcons[item as keyof typeof facilityIcons]} alt={item} className='w-5 h-5' />
                                <p className='text-xs'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ROOM PRICE */}
                <p className='text-2xl font-medium'>{currency}{room.pricePerNight}/night</p>
            </div>

            {/* CHECKIN CHECKOUT FORM */}
            <form onSubmit={onSubmitHandler} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
                    <div className='flex flex-col'>
                        <label htmlFor="checkInDate" className='font-medium'>Check-In</label>
                        <input onChange={(e) => setCheckInDate(e.target.value)} min={new Date().toISOString().split("T")[0]} type="date" id='checkInDate' placeholder='Check-In' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>

                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                    <div className='flex flex-col'>
                        <label htmlFor="checkOutDate" className='font-medium'>Check-Out</label>
                        <input onChange={(e) => setCheckOutDate(e.target.value)} min={checkInDate ?? ""} disabled={!checkInDate} type="date" id='checkOutDate' placeholder='Check-Out' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>

                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                    <div className='flex flex-col'>
                        <label htmlFor="guests" className='font-medium'>Guests</label>
                        <input onChange={(e) => setGuests(Number(e.target.value))} type="number" id='guests' placeholder='1' className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>
                </div>

                <button type='submit' className='bg-primary hover:bg-primary/80 active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer' disabled={loading}>
                    {loading
                        ? (isAvaliable ? "Booking..." : "Checking...")
                        : (isAvaliable ? "Book Now" : "Check Availability")
                    }
                </button>
            </form>

            {/* COMMON SPECIFICATIONS */}
            <div className='mt-25 space-y-4'>
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-center gap-2'>
                        <Image src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5' />

                        <div>
                            <p className='text-base'>{spec.title}</p>
                            <p className='text-gray-500'>{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='mex-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
                <p>
                    Guests will be allocated on the ground floor according to availability. You get a comfortable
                    Two bedroom apartment has a true city feeling. The price quoted is for two guests, at the guest
                    slot please mark the number of guests to get exact price for groups. The Guests will be allocated
                    ground floor according to availability. You get a comfortable
                    Two bedroom apartment has a true city feeling.
                </p>
            </div>

            {/* HOSTED BY */}
            <div className='flex flex-col items-start gap-4'>
                <div className='flex gap-4'>
                    <Image src={room.hotel.owner.image} alt='Host' width={100} height={100} className='h-14 w-14 md:h-18 md:w-18 rounded-full' />

                    <div>
                        <p className='text-lg md:text-xl'>Hosted by {room.hotel.name}</p>
                        <div className='flex items-center mt-1'>
                            <StarRating />
                            <p className='ml-2'>200+ reviews</p>
                        </div>
                    </div>
                </div>


                <button onClick={() => setShowNumber((prev) => !prev)} className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary/80 transition-all cursor-pointer'>Click for number</button>

                {showNumber &&
                    <div className="flex items end gap-1">
                        <Image src={assets.phone_icon} alt="Phone-Icon" className="w-6 h-6" />
                        {room.hotel.contact}
                    </div>
                }

            </div>
        </div>
    )
}

export default RoomDetails
