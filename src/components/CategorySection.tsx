import { Car, Bike, Wrench, Settings, Gauge, Zap } from "lucide-react";
import { useState } from "react";
import { partsData } from "@/data/parts";

const mainVehicleTypes = [
  { icon: Car, label: "Samochody osobowe", vehicleType: "samochód" as const },
  { icon: Bike, label: "Motocykle", vehicleType: "motocykl" as const },
];

const subCategories = [
  { icon: Wrench, label: "Układ hamulcowy" },
  { icon: Settings, label: "Silnik i osprzęt" },
  { icon: Gauge, label: "Zawieszenie" },
  { icon: Zap, label: "Elektryka" },
];

const CategorySection = () => {
  const [activeVehicleType, setActiveVehicleType] = useState<"samochód" | "motocykl" | null>(null);

  const getCount = (category: string, vehicleType?: "samochód" | "motocykl") =>
    partsData.filter((part) => part.category === category && (!vehicleType || part.vehicleType === vehicleType)).length;

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading text-center mb-2">
          Kategorie <span className="text-primary">części</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          Wybierz typ pojazdu, aby zobaczyć dostępne podkategorie.
        </p>

        <div className="flex flex-col items-center gap-8">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {mainVehicleTypes.map(({ icon: Icon, label, vehicleType }) => (
              <button
                key={label}
                onClick={() => setActiveVehicleType(vehicleType)}
                className={`group gradient-card border border-border rounded-lg p-8 text-center transition-all ${
                  activeVehicleType === vehicleType
                    ? "border-primary glow-primary ring-2 ring-primary/50"
                    : "hover:border-primary/50 hover:glow-primary"
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">{label}</p>
                <p className="text-sm text-muted-foreground">
                  {partsData.filter((p) => p.vehicleType === vehicleType).length.toLocaleString("pl-PL")} części
                </p>
              </button>
            ))}
          </div>

          {activeVehicleType && (
            <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  Podkategorie {activeVehicleType === "samochód" ? "samochodów osobowych" : "motocykli"}
                </h3>
                <button
                  onClick={() => setActiveVehicleType(null)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>×</span>
                  <span>Schowaj</span>
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {subCategories.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="group gradient-card border border-border rounded-lg p-5 text-center hover:border-primary/50 transition-all hover:glow-primary"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">{label}</p>
                    <p className="text-xs text-muted-foreground">
                      {getCount(label, activeVehicleType).toLocaleString("pl-PL")} części
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
