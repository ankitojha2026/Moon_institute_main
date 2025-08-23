import HeroSection from "@/components/Home/HeroSection";
import BirthdaySection from "@/components/Home/BirthdaySection";
import FounderSection from "@/components/Home/FounderSection";
import WhyChooseSection from "@/components/Home/WhyChooseSection";
import HeroSectionSlider from "@/components/Home/HeroSectionSlider";
import ToperStudentsSection from "../components/Home/ToperStudentSection";
import MapAndContactInfo from "../components/Home/MapAndContactInfo";
import ScrollAnimation from "../components/common/ScrollAnimation";
import ScrollToTopButton from "../components/common/ScrollToTopButton";


const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <main>
        <ScrollAnimation variant="fade">
          <HeroSection />
        </ScrollAnimation>

        <ScrollAnimation variant="slideUp" delay={0.2}>
          <HeroSectionSlider />
        </ScrollAnimation>

        <ScrollAnimation variant="slideLeft" delay={0.3}>
          <BirthdaySection />
        </ScrollAnimation>

        <ScrollAnimation variant="slideRight" delay={0.4}>
          <ToperStudentsSection />
        </ScrollAnimation>

        <ScrollAnimation variant="zoomIn" delay={0.5}>
          <FounderSection />
        </ScrollAnimation>

        <ScrollAnimation variant="slideUp" delay={0.6}>
          <MapAndContactInfo />
        </ScrollAnimation>

        <ScrollAnimation variant="fade" delay={0.7}>
          <WhyChooseSection />
        </ScrollAnimation>


{/* bottom to top button visibale after 200 px */}

      <ScrollToTopButton/>

      </main>
    </div>
  );
};

export default Index;
