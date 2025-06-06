"use client"

import Image from "next/image";
import { useEffect } from "react"
import { assets } from "../../public/assets";

const HotelReg = () => {

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70">
            <form className="flex bg-white rounded-xl max-w-4xl max-md:mx-2">
                <Image src={assets.registerImage} alt='Reg-Image' className='w-1/2 rounded-xl rounded-r-none hidden md:block' />

                <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
                    <Image src={assets.closeIcon} alt='Close-Icon' className='absolute top-4 right-4 h-4 w-4 cursor-pointer' />
                    <p className='text-2xl font-semibold mt-6'>Register Your Hotel</p>

                    {/* HOTEL NAME */}
                    <div className='w-full mt-4'>
                        <label htmlFor="name" className='font-medium text-gray-500'>Hotel Name</label>
                        <input type="text" id='name' placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>

                    {/* PHONE */}
                    <div className='w-full mt-4'>
                        <label htmlFor="contact" className='font-medium text-gray-500'>Phone</label>
                        <input type="text" id='contact' placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>

                    {/* ADDRESS */}
                    <div className='w-full mt-4'>
                        <label htmlFor="address" className='font-medium text-gray-500'>Address</label>
                        <input type="text" id='address' placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>

                    {/* CITY */}
                    <div className='w-full mt-4'>
                        <label htmlFor="city" className='font-medium text-gray-500'>City</label>
                        <input type="text" id='city' placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>

                    <button className='bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6'>Register</button>
                </div>
            </form>
        </div>
    )
}

export default HotelReg
