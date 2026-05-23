import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BrandSection from "@/components/BrandSection";
import CollectionSection from "@/components/CollectionSection";
import CampaignSection from "@/components/CampaignSection";
import GallerySection from "@/components/GallerySection";
import ReelsSection from "@/components/ReelsSection";
import SocialSection from "@/components/SocialSection";
import ContactSection from "@/components/ContactSection";
import FranchiseSection from "@/components/FranchiseSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <BrandSection />
      <CollectionSection />
      <GallerySection />
      <CampaignSection />
      <ReelsSection />
      <SocialSection />
      <ContactSection />
      <FranchiseSection />
      <Footer />
    </main>
  );
}
