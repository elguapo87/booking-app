"use client"

import { HotelCardProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { assets } from '../../public/assets'

const HotelCard = ({ room, index }: HotelCardProps) => {
  return (
    <Link onClick={() => scrollTo(0, 0)} href={`/rooms/${room._id}`} className='relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]'>
        <Image src={room.images[0]} alt='' width={500} height={500} className='aspect-[2/1]' />
        {
            index % 2 === 0 
                 &&
            <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full'>Best Seller</p>
        }

        <div className="p-4 pt-5">
            <div className="flex items-center justify-between">
                <p className='font-playfair text-xl font-medium text-gray-800 '>{room.hotel.name}</p>
                <div className="flex items-center gap-1">
                    <Image src={assets.starIconFilled} alt='Star-Icon' /> 4.5
                </div>
            </div>

            <div className="flex items-center gap-1 text-sm">
                <Image src={assets.locationIcon} alt='Location-Icon' />
                <span>{room.hotel.address}</span>
            </div>

            <div className="flex items-center justify-between mt-4">
                <p><span className='text-xl text-gray-800'>${room.pricePerNight}</span>/night</p>
                <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer'>
                    Book Now
                </button>
            </div>
        </div>
    </Link>
  )
}

export default HotelCard
