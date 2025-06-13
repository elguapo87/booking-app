'use client';

import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { CheckBoxProps, RadioBtnProps, RoomType } from '@/types';
import Image from 'next/image';
import { AppContext } from '@/context/AppContext';
import StarRating from '@/components/StarRating';
import { assets, facilityIcons } from '../../../../public/assets';

const CheckBox = ({ label, selected = false, onChange = () => { } }: CheckBoxProps) => {
    return (
        <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
            <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
};

const RadioButton = ({ label, selected = false, onChange = () => { } }: RadioBtnProps) => {
    return (
        <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
            <input type='radio' name='sortOption' checked={selected} onChange={(e) => onChange(label)} />
            <span className="font-light select-none">{label}</span>
        </label>
    )
};

type HotelType = {
    _id: string;
    name: string;
    address: string;
    contact: string;
    city: string;
    image: string;
    owner: {
        username: string;
        image: string;
    };
    rooms: RoomType[];
};

const HotelDetailsPage = () => {

    const context = useContext(AppContext);
    if (!context) throw new Error("HotelDetailsPage must be within AppContextProvider");
    const { router, currency } = context;

    const searchParams = useSearchParams();
    const [hotel, setHotel] = useState<HotelType | null>(null);

    const [openFilters, setOpenFilters] = useState(false);

    const roomTypes = [
        "Single Bed",
        "Double Bed",
        "Luxury Room",
        "Family Suite"
    ];

    const priceRange = [
        "0 to 500",
        "500 to 1000",
        "1000 to 2000",
        "2000 to 3000"
    ];

    const sortOptions = [
        "Price Low to High",
        "Price High to Low",
        "Newest First",
    ];

    useEffect(() => {
        const data = searchParams.get('data');
        if (data) {
            try {
                const parsed = JSON.parse(decodeURIComponent(data));
                setHotel(parsed);
            } catch (err) {
                console.error("Failed to parse hotel data from URL:", err);
            }
        }
    }, [searchParams]);

    if (!hotel) return <div className="text-center mt-10 text-lg text-gray-500">Loading hotel details...</div>;

    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 mb-20'>
            {/* LEFT SIDE */}
            <div>
                <h1 className="font-playfair text-4xl md:text-[40px]">{hotel.name} Rooms</h1>

                {hotel.rooms.map((room) => (
                    <div key={room._id} className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0">
                        <Image onClick={() => { router.push(`/rooms/${room._id}`); scrollTo(0, 0) }} src={room.images[0]} alt="Hotel-Image" width={500} height={500} title="View Room Details" className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer" />

                        <div className="md:w-1/2 flex flex-col gap-2">
                            <p className="text-gray-500">{room.hotel.city}</p>

                            <div className="flex items-center">
                                <StarRating />
                                <p className="ml-2">200+ reviews</p>
                            </div>

                            <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                                <Image src={assets.locationIcon} alt="Location-Icon" />
                                <span>{room.hotel.address}</span>
                            </div>

                            {/* ROOM AMENITIES */}
                            <div className="flex flex-wrap items-center mt-2 mb-2 gap-3 -ml-3">
                                {room.amenities.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f5f5ff]/70">
                                        <Image src={facilityIcons[item as keyof typeof facilityIcons]} alt={item} className='w-5 h-5' />
                                        <p className="text-xs">{item}</p>
                                    </div>
                                ))}
                            </div>

                            {/* ROOM PRICE FOR NIGHT */}
                            <p className="text-xl font-medium text-gray-700">{currency} {room.pricePerNight} /night</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* FILTERS */}
            <div className="bg-stone-100/50 w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16">
                <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && "border-b"}`}>
                    <p className="text-base font-medium text-gray-800">FILTERS</p>
                    <div className="text-xs cursor-pointer">
                        <span onClick={() => setOpenFilters(prev => !prev)} className='lg:hidden'>{openFilters ? "HIDE" : "SHOW"}</span>
                        <span className="hidden lg:block">CLEAR</span>
                    </div>
                </div>

                <div className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
                    <div className="px-5 pt-5">
                        <p className="font-medium text-gray-800 pb-2">Popular filters</p>
                        {roomTypes.map((room, index) => (
                            <CheckBox key={index} label={room} />
                        ))}
                    </div>

                    <div className="px-5 pt-5">
                        <p className="font-medium text-gray-800 pb-2">Price Range</p>
                        {priceRange.map((range, index) => (
                            <CheckBox key={index} label={range} />
                        ))}
                    </div>

                    <div className="px-5 pt-5 pb-7">
                        <p className="font-medium text-gray-800 pb-2">Sort By</p>
                        {sortOptions.map((option, index) => (
                            <RadioButton key={index} label={option} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetailsPage;
