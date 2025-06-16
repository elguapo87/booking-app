"use client"

import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { assets } from "../../public/assets";
import { useClerk, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { AppContext } from "@/context/AppContext";

const BookIcon = () => {                
  return (
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
    </svg>
  );
}; 

const Navbar = () => {

    const context = useContext(AppContext);
    if (!context) throw new Error("Navbar must be within AppContextProvider");
    const { isOwner, setShowHotelReg, router, user } = context;

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/hotels' },
        { name: 'Rooms', path: '/rooms' },
        { name: 'About', path: '/' },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [destination, setDestionation] = useState("");
    const [hotelName, setHotelName] = useState("");
    const [searchType, setSearchType] = useState<'destination' | 'hotelName'>("destination")
    const [openSearch, setOpenSearch] = useState(false);

    const { openSignIn } = useClerk();

    const pathName = usePathname();

    const onSearch = () => {
        if (destination && hotelName) {
            router.push(`/rooms/?destination=${destination}&hotelName=${hotelName}`);

        } else if (destination) {
            router.push(`/rooms/?destination=${destination}`);
            
        } else if (hotelName) {
            router.push(`/rooms/?hotelName=${hotelName}`);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (pathName !== "/") {
                setIsScrolled(true);

            } else {
                setIsScrolled(window.scrollY > 10);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathName]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";

        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = ""
        }

    }, [isMenuOpen]);

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-stone-100 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>
            {/* Logo */}
            <Link href="/">
                <Image src={assets.easy_logo} alt="logo" className={`h-7 w-50 ${isScrolled && "invert opacity-80"}`} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <Link key={i} href={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
                        {link.name}
                        <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                    </Link>
                ))}

                {
                    user 
                     &&
                    <button onClick={() => isOwner ? router.push("/hotelOwner") : setShowHotelReg(true) } className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`}>
                        {isOwner ? "Dashboard" : "List Your Hotel"}
                    </button>
                }
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2">
                    {
                        openSearch ? (
                        <>
                            {/* Close button on the left */}
                            <div onClick={() => setOpenSearch(false)} className={`font-bold cursor-pointer ${isScrolled ? "text-gray-800" : "text-stone-50"}`}>
                                X
                            </div>

                            {/* Search bar and select */}
                            <div className="flex items-center">
                            <select 
                                value={searchType} 
                                onChange={(e) => setSearchType(e.target.value as 'destination' | 'hotelName')}
                                className={`text-sm rounded px-1 py-0.5 border outline-none ${isScrolled ? "border-gray-800 text-gray-800" : "border-stone-50 text-stone-50"}`}
                            >
                                <option value="destination" className="text-gray-800">Destination</option>
                                <option value="hotelName" className="text-gray-800">Hotel Name</option>
                            </select>

                            <input
                                onChange={(e) => {
                                if (searchType === 'destination') {
                                    setDestionation(e.target.value);
                                    setHotelName('');
                                } else {
                                    setHotelName(e.target.value);
                                    setDestionation('');
                                }
                                }}
                                value={searchType === 'destination' ? destination : hotelName}
                                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                                placeholder={searchType === "destination" ? "Search destination..." : "Search hotel..."}
                                className={`px-2 border-none outline-none ml-3 ${isScrolled ? "text-gray-800 placeholder:text-gray-400" : "text-stone-50 placeholder:text-stone-50"}`}
                            />
                            </div>

                            {/* Search icon on the right */}
                            <Image 
                            onClick={onSearch} 
                            src={assets.searchIcon} 
                            alt="Search" 
                            className={`h-7 cursor-pointer mr-3 ${isScrolled && "invert"}`} 
                            />
                        </>
                        ) : (
                        <Image 
                            onClick={() => setOpenSearch(true)} 
                            src={assets.searchIcon} 
                            alt="Search" 
                            className={`h-7 cursor-pointer ${isScrolled && "invert"}`} 
                        />
                        )
                    }
                </div>


                {
                    user
                     ?
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => router.push("/myBookings")} />
                        </UserButton.MenuItems>
                    </UserButton>
                     :
                    <button onClick={() => openSignIn()} className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500 cursor-pointer">
                        Login
                    </button>
                }

            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                {
                    user
                     &&
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => router.push("/myBookings")} />
                        </UserButton.MenuItems>
                    </UserButton>
                }
                <Image onClick={() => setIsMenuOpen(prev => !prev)} src={assets.menuIcon} alt="" className={`${isScrolled && "invert"} h-4`} />
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="absolute top-4 left-4">
                    <div className="flex flex-col items-start gap-2">
                        {
                            openSearch ? (
                            <>
                                {/* Close button on the left */}
                                <div onClick={() => setOpenSearch(false)} className="font-bold cursor-pointer text-gray-800">
                                    X
                                </div>

                                {/* Search bar and select */}
                                <div className="flex items-center">
                                    <select 
                                        value={searchType} 
                                        onChange={(e) => setSearchType(e.target.value as 'destination' | 'hotelName')}
                                        className="text-xs rounded px-1 py-0.5 border outline-none border-gray-800 text-gray-800"
                                    >
                                        <option value="destination" className="text-gray-800">Destination</option>
                                        <option value="hotelName" className="text-gray-800">Hotel Name</option>
                                    </select>

                                    <input
                                        onChange={(e) => {
                                        if (searchType === 'destination') {
                                            setDestionation(e.target.value);
                                            setHotelName('');
                                        } else {
                                            setHotelName(e.target.value);
                                            setDestionation('');
                                        }
                                        }}
                                        value={searchType === 'destination' ? destination : hotelName}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                onSearch();
                                                setIsMenuOpen(false);
                                            }
                                        }}
                                        placeholder={searchType === "destination" ? "Search destination..." : "Search hotel..."}
                                        className="px-2 border-none outline-none max-w-1/2 text-sm text-gray-800 placeholder:text-gray-400"
                                    />
                                    {/* Search icon on the right */}
                                    <Image 
                                        onClick={() => { onSearch(); setIsMenuOpen(false) }} 
                                        src={assets.searchIcon} 
                                        alt="Search" 
                                        className="h-7 cursor-pointer mr-3 invert" 
                                    />
                                </div>

                            </>
                            ) : (
                            <Image 
                                onClick={() => setOpenSearch(true)} 
                                src={assets.searchIcon} 
                                alt="Search" 
                                className="h-7 cursor-pointer mr-3 invert" 
                            />
                            )
                        }
                    </div>
                </div>

                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <Image src={assets.closeIcon} alt="close-menu" className="h-6.5" />
                </button>

                {navLinks.map((link, i) => (
                    <Link key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                        {link.name}
                    </Link>
                ))}

                {
                    user 
                     &&
                    <button onClick={() => isOwner ? router.push("/hotelOwner") : setShowHotelReg(true)} className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
                        {isOwner ? "Dashboard" : "List Your Hotel"} 
                    </button>
                }

                {
                    !user
                      &&
                    <button onClick={() => openSignIn()} className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer">
                        Login
                    </button>
                }

            </div>
        </nav>
    );
}

export default Navbar
