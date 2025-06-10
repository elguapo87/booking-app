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


// Title component types
export type TitleProps = {
    title: string;
    subTitle: string;
    align?: string;
    font?: string;
};



// Checkbox props types
export type CheckBoxProps = {
    label: string;
    selected?: boolean;
    onChange?: (checked: boolean, label: string) => void; 
} 

// Radio button props types
export type RadioBtnProps = {
    label: string;
    selected?: boolean;
    onChange?: (label: string) => void;
};


// Booking Data Types
export type BookedRoom = {
    roomType: string;
};

export type RoomUser = {
    username: string;
};

export type Booking = {
    room: BookedRoom;
    totalPrice: number;
    user: RoomUser;
    isPaid: boolean;
};

export interface BookingData {
    totalBookings: number;
    totalRevenue: number;
    bookings: Booking[];
};