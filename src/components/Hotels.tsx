// components/HotelCard.tsx
"use client";
import { useState } from "react";

interface Props {
  image: string;
  title: string;
  location: string;
  contact: string;
}

const Hotel = ({ image, title, location, contact }: Props) => {
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
      className="rounded-xl shadow-xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer max-w-96 bg-white"
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      <img src={image} alt="Hotel" className="w-full h-52 object-cover" />
      <div className="flex items-center justify-between px-4 mt-5 gap-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate max-w-[60%]">{title}</h2>
        <h3 className="text-sm text-gray-600">{location}</h3>
      </div>
      <p className="text-sm px-4 pb-6 text-gray-600 w-5/6">Contact: <span>{contact}</span></p>
    </div>
  );
};

export default Hotel;
