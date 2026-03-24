export type Offer = {
  source: string;
  sourceType: "hurtownia" | "portal";
  price: number;
  inStock: boolean;
};

export type PartWithOffers = {
  id: string;
  name: string;
  brand: string;
  compatibility: string;
  vehicleType: "samochód" | "motocykl";
  oeNumber: string;
  catalogNumber: string;
  category: string;
  specs: Record<string, string>;
  priceHistory: { date: string; price: number }[];
  offers: Offer[];
};

export const partsData: PartWithOffers[] = [
  {
    id: "1",
    name: "Klocki hamulcowe przednie",
    brand: "Brembo",
    compatibility: "BMW E46 / E90",
    vehicleType: "samochód",
    oeNumber: "34 11 6 761 244",
    catalogNumber: "P06024",
    category: "Układ hamulcowy",
    specs: { "Materiał": "Ceramika", "Grubość": "19.8 mm", "Szerokość": "155.1 mm", "Wysokość": "68.5 mm", "Czujnik zużycia": "Tak" },
    priceHistory: [
      { date: "2025-10", price: 210 }, { date: "2025-11", price: 205 }, { date: "2025-12", price: 199 },
      { date: "2026-01", price: 195 }, { date: "2026-02", price: 189 }, { date: "2026-03", price: 189 },
    ],
    offers: [
      { source: "Inter Cars", sourceType: "hurtownia", price: 189.99, inStock: true },
      { source: "Auto Partner", sourceType: "hurtownia", price: 205.00, inStock: true },
      { source: "Allegro", sourceType: "portal", price: 175.50, inStock: true },
      { source: "OLX", sourceType: "portal", price: 169.00, inStock: false },
    ],
  },
  {
    id: "2",
    name: "Filtr oleju",
    brand: "Mann-Filter",
    compatibility: "VW Golf VII 2.0 TDI",
    vehicleType: "samochód",
    oeNumber: "03N 115 562",
    catalogNumber: "HU 7027 z",
    category: "Silnik i osprzęt",
    specs: { "Typ": "Wkład filtra", "Średnica zewn.": "65 mm", "Wysokość": "115 mm", "Średnica wewn.": "31 mm" },
    priceHistory: [
      { date: "2025-10", price: 38 }, { date: "2025-11", price: 36 }, { date: "2025-12", price: 35 },
      { date: "2026-01", price: 34 }, { date: "2026-02", price: 33 }, { date: "2026-03", price: 32 },
    ],
    offers: [
      { source: "Inter Cars", sourceType: "hurtownia", price: 34.90, inStock: true },
      { source: "Allegro", sourceType: "portal", price: 32.50, inStock: true },
      { source: "Hart", sourceType: "hurtownia", price: 36.00, inStock: true },
    ],
  },
  {
    id: "3",
    name: "Łańcuch napędowy 520",
    brand: "DID",
    compatibility: "Honda CBR 600RR",
    vehicleType: "motocykl",
    oeNumber: "40530-MFJ-D01",
    catalogNumber: "520VX3-112",
    category: "Napęd",
    specs: { "Rozmiar": "520", "Ogniwa": "112", "Typ": "X-ring", "Wytrzymałość": "34.0 kN", "Kolor": "Złoty" },
    priceHistory: [
      { date: "2025-10", price: 265 }, { date: "2025-11", price: 258 }, { date: "2025-12", price: 250 },
      { date: "2026-01", price: 248 }, { date: "2026-02", price: 245 }, { date: "2026-03", price: 245 },
    ],
    offers: [
      { source: "MotoIntegrator", sourceType: "portal", price: 245.00, inStock: true },
      { source: "Inter Cars", sourceType: "hurtownia", price: 260.00, inStock: true },
      { source: "Allegro", sourceType: "portal", price: 235.00, inStock: true },
    ],
  },
  {
    id: "4",
    name: "Amortyzator tylny",
    brand: "Bilstein",
    compatibility: "Audi A4 B8",
    vehicleType: "samochód",
    oeNumber: "8K0 513 035 N",
    catalogNumber: "19-227917",
    category: "Zawieszenie",
    specs: { "Typ": "Gazowy", "Długość": "520 mm", "Siła tłumienia": "Regulowana", "Montaż": "Dolny uchwyt" },
    priceHistory: [
      { date: "2025-10", price: 460 }, { date: "2025-11", price: 450 }, { date: "2025-12", price: 440 },
      { date: "2026-01", price: 430 }, { date: "2026-02", price: 420 }, { date: "2026-03", price: 420 },
    ],
    offers: [
      { source: "Auto Partner", sourceType: "hurtownia", price: 420.00, inStock: false },
      { source: "Inter Cars", sourceType: "hurtownia", price: 445.00, inStock: true },
      { source: "Allegro", sourceType: "portal", price: 399.00, inStock: true },
    ],
  },
  {
    id: "5",
    name: "Świece zapłonowe iridowe",
    brand: "NGK",
    compatibility: "Toyota Corolla 1.6",
    vehicleType: "samochód",
    oeNumber: "90919-01253",
    catalogNumber: "DILKAR7C9H",
    category: "Elektryka",
    specs: { "Typ": "Iridowa", "Rozmiar klucza": "14 mm", "Gwint": "M12x1.25", "Zasięg iskry": "1.0 mm" },
    priceHistory: [
      { date: "2025-10", price: 52 }, { date: "2025-11", price: 50 }, { date: "2025-12", price: 48 },
      { date: "2026-01", price: 46 }, { date: "2026-02", price: 45 }, { date: "2026-03", price: 42 },
    ],
    offers: [
      { source: "Inter Cars", sourceType: "hurtownia", price: 45.90, inStock: true },
      { source: "Hart", sourceType: "hurtownia", price: 48.00, inStock: true },
      { source: "Allegro", sourceType: "portal", price: 42.00, inStock: true },
      { source: "OLX", sourceType: "portal", price: 39.90, inStock: true },
    ],
  },
  {
    id: "6",
    name: "Tarcze hamulcowe przód",
    brand: "Zimmermann",
    compatibility: "Mercedes W204",
    vehicleType: "samochód",
    oeNumber: "A204 421 12 12",
    catalogNumber: "100.3358.20",
    category: "Układ hamulcowy",
    specs: { "Średnica": "295 mm", "Grubość": "28 mm", "Typ": "Wentylowane", "Min. grubość": "25.4 mm" },
    priceHistory: [
      { date: "2025-10", price: 360 }, { date: "2025-11", price: 355 }, { date: "2025-12", price: 350 },
      { date: "2026-01", price: 345 }, { date: "2026-02", price: 340 }, { date: "2026-03", price: 320 },
    ],
    offers: [
      { source: "Inter Cars", sourceType: "hurtownia", price: 340.00, inStock: true },
      { source: "OLX", sourceType: "portal", price: 320.00, inStock: true },
      { source: "Auto Partner", sourceType: "hurtownia", price: 355.00, inStock: true },
    ],
  },
  {
    id: "7",
    name: "Pasek rozrządu z napinaczem",
    brand: "Continental",
    compatibility: "Skoda Octavia 1.9 TDI",
    vehicleType: "samochód",
    oeNumber: "038 198 119 C",
    catalogNumber: "CT1028K2",
    category: "Silnik i osprzęt",
    specs: { "Zęby": "153", "Szerokość": "25 mm", "Zestaw": "Pasek + napinacz + rolka", "Materiał": "HNBR" },
    priceHistory: [
      { date: "2025-10", price: 300 }, { date: "2025-11", price: 295 }, { date: "2025-12", price: 285 },
      { date: "2026-01", price: 280 }, { date: "2026-02", price: 275 }, { date: "2026-03", price: 255 },
    ],
    offers: [
      { source: "Hart", sourceType: "hurtownia", price: 275.00, inStock: true },
      { source: "Allegro", sourceType: "portal", price: 255.00, inStock: true },
      { source: "Inter Cars", sourceType: "hurtownia", price: 290.00, inStock: true },
    ],
  },
  {
    id: "8",
    name: "Klocki hamulcowe tył",
    brand: "Ferodo",
    compatibility: "Yamaha MT-07",
    vehicleType: "motocykl",
    oeNumber: "1WS-W0046-00",
    catalogNumber: "FDB2258ST",
    category: "Układ hamulcowy",
    specs: { "Materiał": "Spiekane", "Typ": "Sportowe", "Grubość": "8.6 mm", "Szerokość": "41 mm" },
    priceHistory: [
      { date: "2025-10", price: 115 }, { date: "2025-11", price: 110 }, { date: "2025-12", price: 105 },
      { date: "2026-01", price: 102 }, { date: "2026-02", price: 98 }, { date: "2026-03", price: 92 },
    ],
    offers: [
      { source: "MotoIntegrator", sourceType: "portal", price: 98.50, inStock: false },
      { source: "Allegro", sourceType: "portal", price: 92.00, inStock: true },
      { source: "Inter Cars", sourceType: "hurtownia", price: 105.00, inStock: true },
    ],
  },
];

export const allBrands = [...new Set(partsData.map((p) => p.brand))].sort();
export const allSources = [...new Set(partsData.flatMap((p) => p.offers.map((o) => o.source)))].sort();
export const allCategories = [...new Set(partsData.map((p) => p.category))].sort();
