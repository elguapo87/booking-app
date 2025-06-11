"use client";

import Hotel from "@/components/Hotels";



const hotels = [
  {
    image: "https://images.unsplash.com/photo-1747134392471-831ea9a48e1e?q=80&w=2000&auto=format&fit=crop",
    title: "Crown Plazasa",
    location: "Belgrade",
    contact: "+381-555-333"
  },
];

const HotelsPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mx-4 md:mx-16 lg:mx-32 mt-50 pb-20 md:pb-40">
      {hotels.map((hotel, index) => (
        <Hotel key={index} {...hotel} />
      ))}
    </div>
  );
};

export default HotelsPage;
