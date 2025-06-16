import ExclusiveOffers from "@/components/ExclusiveOffers";
import FeaturedDestination from "@/components/FeaturedDestination";
import Hero from "@/components/Hero";
import RecommendedHotels from "@/components/RecommendedHotels";
import Testimonial from "@/components/Testimonial";

export default function Home() {
  return (
    <>
      <Hero />
      <RecommendedHotels />
      <FeaturedDestination />
      <ExclusiveOffers />
      <Testimonial />
    </>
  );
}
