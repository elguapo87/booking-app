"use client"

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { assets } from '../../../public/assets';
import Title from '@/components/Title';
import Image from 'next/image';
import { AppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { UserBookingsType } from '@/types';

const MyBookings = () => {

    const context = useContext(AppContext);
    if (!context) throw new Error("MyBookingsPage must be within AppContextProvider");
    const { user, getToken, axios } = context;

    const [bookings, setBookings] = useState<UserBookingsType[]>([]);

    const handlePayment = async (bookingId: string) => {
        const token = await getToken();

        try {
            const { data } = await axios.post("/api/stripe/stripePayment", { bookingId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                window.location.href = data.url;

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };

    const fetchUserBookings = useCallback(async () => {
        const token = await getToken();

        try {
            const { data } = await axios.get("/api/booking/getUserBookings", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    }, [getToken, axios]);

    const cancelBooking = async (bookingId: string) => {
        try {
            const token = await getToken();

            const { data } = await axios.post("/api/booking/cancelBooking", { bookingId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success(data.message);
                fetchUserBookings();

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserBookings();
        }
    }, [user, fetchUserBookings]);

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title
                title="My Bookings"
                subTitle='Easily manage your past, current and upcoming hotel reservations in one place.
                          Plan your trips seamlessly with just few clicks'
                align='left'
            />

            <div className='max-w-6xl mt-8 w-full text-gray-800'>
                <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
                    <div className='w-1/3'>Hotels</div>
                    <div className='w-1/3'>Date & Timings</div>
                    <div className='w-1/3'>Payment</div>
                </div>

                {bookings.map((booking) => (
                    <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
                        {/* HOTEL DETAILS */}
                        <div className='flex flex-col md:flex-row'>
                            <Image src={booking.room.images[0]} alt='Hotel-Image' width={100} height={100} className='min-md:w-44 rounded shadow object-cover' />
                            <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                                <p className='font-playfair text-2xl'>{booking.hotel.name}<span className='font-inter text-sm'> ({booking.room.roomType})</span></p>

                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <Image src={assets.locationIcon} alt='Location-Icon' />
                                    <span>{booking.hotel.address}</span>
                                </div>

                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <Image src={assets.guestsIcon} alt='Guest-Icon' />
                                    <span>Guests: {booking.guests}</span>
                                </div>

                                <p className='text-base'>Total: ${booking.totalPrice}</p>
                            </div>
                        </div>

                        {/* DATE & TIMEINGS */}
                        <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                            <div>
                                <p>Check-In:</p>
                                <p className='text-gray-500 text-sm'>{new Date(booking.checkInDate).toDateString()}</p>
                            </div>

                            <div>
                                <p>Check-Out:</p>
                                <p className='text-gray-500 text-sm'>{new Date(booking.checkOutDate).toDateString()}</p>
                            </div>
                        </div>

                        {/* PAYMENT STATUS */}
                        <div className='flex flex-col items-start justify-center pt-3'>
                            <div className='flex items-center gap-2'>
                                <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                                <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>{booking.isPaid ? "Paid" : "Unpaid"}</p>
                            </div>

                            {!booking.isPaid && (
                                <div className='flex items-center gap-2'>
                                    <button onClick={() => handlePayment(booking._id)} className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'>Pay Now</button>
                                    <button onClick={() => cancelBooking(booking._id)} className='px-4 py-1.5 mt-4 text-xs border border-red-300 rounded-full text-red-500 hover:bg-red-50 transition-all cursor-pointer'>Cancel</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyBookings
