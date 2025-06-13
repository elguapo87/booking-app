"use client";
import { AppContext } from "@/context/AppContext";
import { RoomType } from "@/types";
import Image from "next/image";
import { useContext, useState } from "react";

type OwnerType = {
  username: string;
  image: string;
};

type AllHotelsData = {
  _id: string;
  name: string;
  address: string;
  contact: string;
  city: string;
  image: string;
  owner: OwnerType;
  rooms: RoomType[];
};


const AllHotels = ({ hotel }: { hotel: AllHotelsData }) => {

  const context = useContext(AppContext);
  if (!context) throw new Error("AllHotels must be within AppContextProvider");
  const { router } = context;

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const threshold = 12;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ x: y * -threshold, y: x * threshold });
  };

  return (
    <div
      onClick={() => {
        const encodedHotel = encodeURIComponent(JSON.stringify(hotel));
        router.push(`/hotels/${hotel._id}?data=${encodedHotel}`);
      }}

      className="rounded-xl shadow-xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer max-w-96 bg-stone-50"
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      <Image src={hotel.image} alt="Hotel" width={500} height={500} className="w-full h-52 object-cover" />
      <div className="flex items-center justify-between px-4 mt-5 gap-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate max-w-[60%]">{hotel.name}</h2>
        <h3 className="text-sm text-gray-600">{hotel.city}</h3>
      </div>
      <p className="text-sm px-4 pb-1 text-gray-600 w-5/6">Contact: <span>{hotel.contact}</span></p>
      <p className="text-sm px-4 pb-3 text-gray-600 w-5/6">Address: <span>{hotel.address}</span></p>

      <div className="flex items-end gap-3 justify-between px-4 pb-6">
        <h3 className=" text-gray-700 text-lg">
          <span className="text-gray-600 text-base">Owner: </span>
          {hotel.owner.username}
        </h3>
        <Image src={hotel.owner.image} alt="Owner-Image" width={100} height={100} className="w-10 h-10 object-cover rounded-full" />
      </div>
    </div>
  );
};

export default AllHotels;
