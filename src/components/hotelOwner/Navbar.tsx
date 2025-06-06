import Image from "next/image"
import Link from "next/link"
import { assets } from "../../../public/assets"
import { UserButton } from "@clerk/nextjs"

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
      <Link href="/">
        <Image src={assets.easy_logo} alt="Logo" className="h-7 w-50 invert opacity-80" />
      </Link>

      <UserButton />
    </div>
  )
}

export default Navbar
