"use client"

import { AppContext } from '@/context/AppContext';
import { RoomType } from '@/types';
import React, { useContext, useEffect, useState } from 'react'
import Title from './Title';
import HotelCard from './HotelCard';

const RecommendedHotels = () => {

    const context = useContext(AppContext);
    if (!context) throw new Error("RecommendedHotels must be within AppContextProvider");
    const { rooms, searchedCities } = context;

    const [recommended, setRecommended] = useState<RoomType[]>([]);

    useEffect(() => {
        const filteredHotels = rooms.slice().filter((room) =>
            searchedCities.includes(room.hotel.city)
        );
        setRecommended(filteredHotels);
    }, [rooms, searchedCities]);

    return recommended.length > 0 && (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
            <Title
                title="Recommended Hotels"
                subTitle="Discover our handpicked selection of exceptional properties around the world, offering 
                          unparalleled luxury and unforgettable experiences."
            />

            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
                {recommended.slice(0, 4).map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index} />
                ))}
            </div>
        </div>
    )
}

export default RecommendedHotels
