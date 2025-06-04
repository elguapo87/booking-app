import Image from 'next/image'
import React from 'react'
import { assets } from '../../public/assets'

const StarRating = ({ rating = 4 }) => {
  return (
    <>
      {Array(5).fill("").map((_, index) => (
        <Image key={index} src={rating > index ? assets.starIconFilled : assets.starIconOutlined} alt='Star-Icon' className="h-4.5 w-4.5" />
      ))}
    </>
  )
}

export default StarRating
