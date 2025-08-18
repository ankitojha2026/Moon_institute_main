import HeroSection from "@/components/Home/HeroSection";
import BirthdaySection from "@/components/Home/BirthdaySection";
import FounderSection from "@/components/Home/FounderSection";
import TopStudentsSection from "@/components/Home/TopStudentsSection";
import WhyChooseSection from "@/components/Home/WhyChooseSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <BirthdaySection />
        <FounderSection />
        {/* <TopStudentsSection /> */}
        <WhyChooseSection />
      </main>
    </div>
  );
};

export default Index;