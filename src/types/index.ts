import { StaticImageData } from "next/image";

export type UserType = {
    _id: string;
    username: string;
    email: string;
    image: string;
    role: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    __v?: number;
    recentSearchedCities: string[];
};

export type HotelType = {
    _id: string;
    name: string;
    address: string;
    contact: string;
    owner: UserType;
    city: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    __v?: number;
};

export type RoomType = {
    _id: string;
    hotel: HotelType;
    roomType: string;
    pricePerNight: number;
    amenities: string[];
    images: (string | StaticImageData)[];
    isAvailable: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    __v?: number;
};

// Props for HotelCard component
export type HotelCardProps = {
    room: RoomType;
    index: number;
};