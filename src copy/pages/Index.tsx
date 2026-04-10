import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import PartsGrid from "@/components/PartsGrid";
import PortalsSection from "@/components/PortalsSection";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-16">
        <HeroSection onSearch={setSearchQuery} />
        <CategorySection />
        <PartsGrid searchQuery={searchQuery} />
        <PortalsSection searchQuery={searchQuery} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
