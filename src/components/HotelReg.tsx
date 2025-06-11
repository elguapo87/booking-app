"use client"

import Image from "next/image";
import { useContext, useEffect, useState } from "react"
import { assets } from "../../public/assets";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const HotelReg = () => {

    const context = useContext(AppContext);
    if (!context) throw new Error("HotelReg must be within AppContextProvider");
    const { setShowHotelReg, axios, getToken, setIsOwner } = context;

    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const onSubmitHandler = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        try {
            const token = await getToken();
            const { data } = await axios.post("/api/hotel/registerHotel", {
                name,
                contact,
                address,
                city
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (data.success) {
                toast.success(data.message);
                setIsOwner(true);
                setShowHotelReg(false);

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    return (
        <div onClick={() => setShowHotelReg(false)} className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70">
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex bg-white rounded-xl max-w-4xl max-md:mx-2">
                <Image src={assets.registerImage} alt='Reg-Image' className='w-1/2 rounded-xl rounded-r-none hidden md:block' />

                <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
                    <Image onClick={() => setShowHotelReg(false)} src={assets.closeIcon} alt='Close-Icon' className='absolute top-4 right-4 h-4 w-4 cursor-pointer' />
                    <p className='text-lg md:text-2xl font-semibold md:mt-6'>Register Your Hotel</p>

                    {/* HOTEL IMAGE */}
                    <div className="w-full mt-4 md:mt-6">
                        <label htmlFor="image" className="flex items-end justify-between" >
                            <span className="font-medium text-gray-500 md:mb-2">Hotel Image</span>
                            <input onChange={(e) => setImage(e.target.files && e.target.files[0])} type="file" id="image" hidden />
                            <Image src={image ? URL.createObjectURL(image) : assets.uploadArea} width={100} height={100} alt="" className="w-18 h-10 md:w-25 md:h-15 rounded md:mr-5" />
                        </label>
                    </div>

                    <div className="bg-gray-300 w-full my-1.5 md:my-3 h-[1px]"></div>

                    {/* HOTEL NAME */}
                    <div className='w-full mt-2'>
                        <label htmlFor="name" className='font-medium text-gray-500'>Hotel Name</label>
                        <input onChange={(e) => setName(e.target.value)} value={name} type="text" id='name' placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-1.5 md:py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>

                    {/* PHONE */}
                    <div className='w-full mt-4'>
                        <label htmlFor="contact" className='font-medium text-gray-500'>Phone</label>
                        <input onChange={(e) => setContact(e.target.value)} value={contact} type="text" id='contact' placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-1.5 md:py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>

                    {/* ADDRESS */}
                    <div className='w-full mt-4'>
                        <label htmlFor="address" className='font-medium text-gray-500'>Address</label>
                        <input onChange={(e) => setAddress(e.target.value)} value={address} type="text" id='address' placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-1.5 md:py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>

                    {/* CITY */}
                    <div className='w-full mt-4'>
                        <label htmlFor="city" className='font-medium text-gray-500'>City</label>
                        <input onChange={(e) => setCity(e.target.value)} value={city} type="text" id='city' placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-1.5 md:py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>

                    <button type="submit" className='bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-4 py-1.25 md:px-6 md:py-2 rounded cursor-pointer mt-6'>Register</button>
                </div>
            </form>
        </div>
    )
}

export default HotelReg
