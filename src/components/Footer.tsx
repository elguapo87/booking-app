import Image from "next/image"
import { assets } from "../../public/assets"

const Footer = () => {
    return (
        <div className="bg-[#e9e9e99f] text-gray-500/80 md:pt-8 px-6 md:px-16 lg:px-24 xl:px-32 mt-40 max-md:pt-20">
            <div className='flex flex-wrap justify-around gap-12 md:gap-6'>
                <div className='max-w-80'>
                    <Image src={assets.easy_logo} alt="Logo" className='mb-4 h-7 w-50 invert opacity-80' />
                    <p className='text-sm'>
                        Discover the world's most extraordinary places to stay, from butique hotels to luxury villas and private islands.
                    </p>
                    <div className='flex items-center gap-3 mt-4'>
                        <Image src={assets.instagramIcon} alt="Instagram-Icon" className="w-6" />
                        <Image src={assets.facebookIcon} alt="Facebook-Icon" className="w-6" />
                        <Image src={assets.twitterIcon} alt="Twitter-Icon" className="w-6" />
                        <Image src={assets.linkendinIcon} alt="Linkendin-Icon" className="w-6" />
                    </div>
                </div>

                <div>
                    <p className='font-playfair text-lg text-gray-800'>COMPANY</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Partners</a></li>
                    </ul>
                </div>

                <div>
                    <p className='font-playfair text-lg text-gray-800'>SUPPORT</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Safety Information</a></li>
                        <li><a href="#">Cancellation Options</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>

                
            </div>

            <hr className='border-gray-300 mt-8' />
            <div className='flex items-center justify-center max-md:text-sm  py-5'>
                <p>© {new Date().getFullYear()} pg@dev. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer
