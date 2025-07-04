import React from 'react';
import Title from './Title';
import { testimonials } from '../../public/assets';
import Image from 'next/image';
import StarRating from './StarRating';

const Testimonial = () => {
    return (
        <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 md:pb-40">
            <Title
                title="What Our Guests Say"
                subTitle="Discover why discerning travelers consistently choose Easy Booking for their exclusive and
                          luxurious accommodations around the world."
            />

            <div className="flex flex-wrap items-center gap-6 mt-20">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow">
                        <div className="flex items-center gap-3">
                            <Image
                                src={testimonial.image}
                                alt={testimonial.name}
                                width={100}
                                height={100}
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <p className="font-playfair text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.address}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 mt-4">
                            <StarRating />
                        </div>

                        <p
                            className="text-gray-500 max-w-90 mt-4"
                            dangerouslySetInnerHTML={{ __html: testimonial.review }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonial;
