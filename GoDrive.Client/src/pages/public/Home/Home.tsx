import { useGetCarsQuery } from "../../../redux/features/cars/carsApi";
import { useAppSelector } from "../../../redux/hooks";
import { selectCurrentUser } from "../../../redux/features/auth/authSlice";
import HeroSection from "./components/HeroSection";
import ValueStrip from "./components/ValueStrip";
import FeaturedCars from "./components/FeaturedCars";
import HowItWorks from "./components/HowItWorks";
import JourneySection from "./components/JourneySection";
import BenefitsSection from "./components/BenefitsSection";
import CTASection from "./components/CTASection";
import LandingFooter from "./components/LandingFooter";

export default function Home() {
  const user = useAppSelector(selectCurrentUser);
  const { data, isLoading } = useGetCarsQuery({ pageNumber: 1, pageSize: 6 });

  const featuredCars = data?.items ?? [];
  const heroImage = featuredCars.find((car) => car.primaryImageUrl)?.primaryImageUrl ?? null;
  const darkSectionImage =
    featuredCars.find((car) => car.primaryImageUrl && car.primaryImageUrl !== heroImage)?.primaryImageUrl ?? null;

  return (
    <div className="landing">
      <HeroSection heroImage={heroImage} />
      <ValueStrip />
      <FeaturedCars cars={featuredCars} isLoading={isLoading} />
      <HowItWorks />
      <JourneySection image={darkSectionImage} />
      <BenefitsSection />
      <CTASection isAuthenticated={!!user} />
      <LandingFooter isAuthenticated={!!user} />
    </div>
  );
}
