import Image from 'next/image'
import React from 'react'
import { assets } from '../../../public/assets'

const AboutPage = () => {
    return (
        <div className="flex flex-col items-center text-center mt-20 md:mt-30 pb-20">
            <h3 className="text-3xl md:text-4xl font-medium text-gray-800 mb-6">About Us</h3>
            <h1 className="text-xl font-semibold mb-10 text-gray-800">Why Choose Us</h1>
            <p className="w-3/5 mb-14 text-gray-500 text-[15px]">
                Experience the Difference with Easy Booking &copy;
                Discover a new standard in hotel booking. Easy Booking &copy; is built on the principles of simplicity, reliability, and unparalleled customer service. Let us guide you to your next perfect stay.
            </p>
            <div className="flex flex-wrap gap-6 items-start justify-center">
                <div className="group flex flex-col items-center py-8 text-sm bg-white border border-gray-300/60 w-64 rounded-md cursor-pointer hover:border-blue-600 hover:bg-blue-600 transition">
                    <Image className="w-24 rounded-full group-hover:invert" src={assets.hand_gear} width={100} height={100} alt="userImage1" />
                    <h2 className="text-gray-700 group-hover:text-white text-lg font-medium mt-2">10+ Years of Experience</h2>
                    <p className="text-gray-500 group-hover:text-white/80">A Decade of Dedication in Hospitality</p>
                    <p className="text-center text-gray-500/80 group-hover:text-white/60 w-3/4 mt-4">
                        A Decade of Dedication in Hospitality
                        With over 10 years of experience in the travel and hospitality industry, [Your Website Name] brings a wealth of knowledge and expertise to your hotel booking journey. We've spent a decade understanding what travelers need and what makes a truly exceptional stay. 
                    </p>
                </div>

                <div className="group flex flex-col items-center py-8 text-sm bg-white border border-gray-300/60 w-64 rounded-md cursor-pointer hover:border-blue-600 hover:bg-blue-600 transition">
                    <Image className="w-24 rounded-full group-hover:invert" src={assets.handshake} width={100} height={100} alt="userImage2" />
                    <h2 className="text-gray-700 group-hover:text-white text-lg font-medium mt-2">Trust</h2>
                    <p className="text-gray-500 group-hover:text-white/80">Your Trust, Our Priority</p>
                    <p className="text-center text-gray-500/80 group-hover:text-white/60 w-3/4 mt-4">
                        At Easy Booking &copy;, your peace of mind is paramount. We understand that booking travel online requires trust, and we've built our platform around earning and maintaining yours. We achieve this through, customers trustness.
                    </p>
                </div>

                <div className="group flex flex-col items-center py-8 text-sm bg-white border border-gray-300/60 w-64 rounded-md cursor-pointer hover:border-blue-600 hover:bg-blue-600 transition">
                    <Image className="w-24 rounded-full group-hover:invert" src={assets.low_price} width={100} height={100} alt="userImage3" />
                    <h2 className="text-gray-700 group-hover:text-white text-lg font-medium mt-2">Lowest Prices</h2>
                    <p className="text-gray-500 group-hover:text-white/80">Unbeatable Prices, Right Here in Easy Booking &copy;</p>
                    <p className="text-center text-gray-500/80 group-hover:text-white/60 w-3/4 mt-4">
                        At Easy Booking &copy; we are committed to helping you find the best value for your stay in this part of Europe. We constantly monitor prices across a wide range of hotels, from cozy guesthouses to luxurious resorts, to ensure you get the most competitive rates available.


                    </p>
                </div>
            </div>
        </div>
    )
}

export default AboutPage
