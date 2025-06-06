"use client"

import { usePathname } from 'next/navigation'
import React from 'react'
import { assets } from '../../../public/assets';
import Link from 'next/link';
import Image from 'next/image';

const Sidebar = () => {

  const pathName = usePathname();

  const sidebarLinks = [
    { name: "Dashboard", path: "/hotelOwner", icon: assets.dashboardIcon },
    { name: "Add Room", path: "/hotelOwner/addRoom", icon: assets.addIcon },
    { name: "Room List", path: "/hotelOwner/roomList", icon: assets.listIcon }
  ];

  return (
    <div className='md:w-64 w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col transition-all duration-300'>
      {sidebarLinks.map((item, index) => {
        const isActive = pathName === item.path;

        return (
          <Link
            key={index}
            href={item.path}
            className={`flex items-center py-3 px-4 md:px-8 gap-3 ${
              isActive
                 ?
              "border-r-4 md:border-r-[6px] bg-blue-600/10 border-blue-600 text-blue-600"
                 :
              "hover:bg-gray-100/90 border-white text-gray-700"
            }`}
          >
            <Image src={item.icon} alt={item.name} className='min-h-6 min-w-6' />
            <p className='md:block hidden text-center'>{item.name}</p>
          </Link>
        )
      })}
    </div>
  )
}

export default Sidebar
