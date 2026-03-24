import heroBg from "@/assets/hero-bg.jpg";
import AdvancedSearch from "./AdvancedSearch";

const HeroSection = ({ onSearch }: { onSearch: (query: string) => void }) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="absolute inset-0 gradient-hero opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-4">
          <span className="text-primary">Auto</span>
          <span className="text-foreground">Części</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Znajdź części do samochodów i motocykli w hurtowniach i portalach internetowych
        </p>

        <AdvancedSearch onSearch={onSearch} />

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {["Filtry oleju", "Klocki hamulcowe", "Świece zapłonowe", "Łańcuch napędowy"].map((tag) => (
            <button
              key={tag}
              onClick={() => onSearch(tag)}
              className="px-4 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-full border border-border hover:border-primary/50 hover:text-primary transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
