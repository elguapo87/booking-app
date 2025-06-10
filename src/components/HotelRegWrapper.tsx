"use client"

import { AppContext } from '@/context/AppContext';
import React, { useContext } from 'react'
import HotelReg from './HotelReg';

const HotelRegWrapper = () => {

    const context = useContext(AppContext);
    if (!context) throw new Error("HotelRegWrapper must be within AppContextProvider");
    const { showHotelReg } = context;

    return (
        <>
            {showHotelReg && <HotelReg />}
        </>
    )
}

export default HotelRegWrapper
