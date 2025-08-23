import HeroSection from "@/components/Home/HeroSection";
import BirthdaySection from "@/components/Home/BirthdaySection";
import FounderSection from "@/components/Home/FounderSection";
import WhyChooseSection from "@/components/Home/WhyChooseSection";
import HeroSectionSlider from "@/components/Home/HeroSectionSlider";
import ToperStudentsSection from "../components/Home/ToperStudentSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <HeroSectionSlider />

        <BirthdaySection />
        <ToperStudentsSection/>
        <FounderSection />
        {/* <TopStudentsSection /> */}
        <WhyChooseSection />
      </main>
    </div>
  );
};

export default Index;